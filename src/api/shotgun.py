#!/usr/bin/python

# Notes:
# the TSS uses the word SHOW instead of PROJECT

import shotgun_api3
import psycopg2
import datetime
from config import AF_Config


class Shotgun:
	
	def __init__(self):
	 	#self.script_auth()
	 	self.script_auth()
	 	self.conn = AF_Config().db_conn()
	 	self.cur = self.conn.cursor()


	def script_auth(self):
		try:
			self.sg = shotgun_api3.Shotgun("https://"+AF_Config().sg_subdomain+".shotgunstudio.com",
                		    	    	  	script_name=AF_Config().sg_script,
            	   	    	    	  	  	api_key=AF_Config().sg_api_key)
		except():
			return False;


	def get_shows(self, status):
		# get all shows regardless of status; else get specific show based on id
		if status is 'all':
			return self.sg.find('Project', [], ['id', 'name', 'sg_status','sg_description'])
		else:
			return self.sg.find('Project', [['sg_status','is', status]], ['id', 'name', 'sg_status','sg_description'])


	def get_shots(self, project):
		filters = [['project', 'is', project]] 
		return self.sg.find('Shot', filters, ['code'])		

	def get_assets(self, project):
		filters = [
					['project', 'is', project],
					['sg_asset_type', 'is_not', 'tool'],
					['sg_asset_type', 'is_not', 'lightset'],
					['sg_asset_type', 'is_not', 'template'],
					['sg_asset_type', 'is_not', 'lidar'],
					['sg_asset_type', 'is_not', 'lut'],
					['sg_asset_type', 'is_not', 'camera']
				  ] 
		return self.sg.find('Asset', filters, ['code', 'name', 'sg_asset_type'])				


	def sync(self):
		print "// Syncing SG to TSS //"

		projects = self.get_shows('Active')
		for p in projects:
			if p['id'] > 63: # skip the demo projects and templates
				print p['sg_description']

				data = {}
				data['showKey'] = p['id']
				data['showName'] = p['name']
				data['sg_description'] = p['sg_description']
				data['sgStatus'] = p['sg_status']
				
				
				# check to see if show is in db, if not then add
				self.cur.execute("""SELECT show."shotgunKey" FROM show WHERE show."shotgunKey"="""+str(p['id'])+""" LIMIT 1""")
				rows = self.cur.fetchall()

				if len(rows) <= 0:
					self.cur.execute("""INSERT INTO show ("shotgunKey", "showTitle", "showCode") VALUES ("""+str(p['id'])+""",'"""+p['sg_description']+"""','"""+p['name']+"""')""")
					self.conn.commit()

				# get showKey from tss database
				self.cur.execute("""SELECT show."showKey" FROM show WHERE show."shotgunKey"="""+str(p['id'])+""" LIMIT 1""")
				row = self.cur.fetchall()
				showKey = row[0][0]


				# get SHOTS associated with this show from TSS db
				existing_shots = []
				self.cur.execute("""SELECT shot."shotgunKey" FROM shot WHERE shot."showKey"="""+str(showKey)+""" """)
				rows = self.cur.fetchall()

				# add to existing shots list
				for row in rows:
					existing_shots.append(row[0])

				# get SHOTS associated with this show from SG
				shots = self.get_shots(p)

				shots_to_add = []
				for s in shots:
					data = {}
					data['showKey'] = showKey
					data['shotgunKey'] = s['id']
					data['shotTitle'] = s['code']

					# add shot to database (only adds show if not currently in db)
					if s['id'] not in existing_shots:
						shots_to_add.append(data)
				
				# insert for shots to add
				if len(shots_to_add) > 0 :
					self.cur.executemany("""INSERT INTO shot ("showKey","shotgunKey","shotTitle") VALUES (%(showKey)s, %(shotgunKey)s, %(shotTitle)s)""", shots_to_add)
					self.conn.commit()


				# get ASSETS associated with this show
				existing_assets = []
				self.cur.execute("""SELECT asset."shotgunKey" FROM asset WHERE asset."showKey"="""+str(showKey)+""" """)

				rows = self.cur.fetchall()
				for row in rows:
					existing_assets.append(row[0])

				# get ASSETS associated with this show from SG
				assets = self.get_assets(p)
				
				assets_to_add = []
				for a in assets:
					data = {}
					data['showKey'] = showKey
					data['shotgunKey'] = a['id']
					data['assetTitle'] = a['code']

					# add shot to database (only adds show if not currently in db)
					if a['id'] not in existing_assets:
						assets_to_add.append(data)

				# insert for assets to add
				if len(assets_to_add) > 0 :
					self.cur.executemany("""INSERT INTO asset ("showKey","shotgunKey","assetTitle") VALUES (%(showKey)s, %(shotgunKey)s, %(assetTitle)s)""", assets_to_add)					
					self.conn.commit()
		
		print "// Done Syncing SG to TSS //"


	def update_statuses(self):
		print "// Updating Statuses //"

		# get current shows in database: 
		self.cur.execute("""SELECT show."shotgunKey", show."archived" FROM show""")
		rows = self.cur.fetchall()

		# add shows to dictionary with shotgunKey as dictionary key
		shows = {}
		for row in rows:
			shows[row[0]] = row[1]

		# get all shows from SG
		shows = self.get_shows('all')
		archived = []
		not_archived = []

		# loop through shows to see if Active or not
		for s in shows:
			if s['id'] in shows:				
				if s['sg_status'] not in ['Active']:
					archived.append({'id' : s['id']})
				else:
					not_archived.append({'id' : s['id']})

		if len(archived) > 0:
			self.cur.executemany("""UPDATE show SET archived=1 WHERE "shotgunKey"=%(id)s""", archived)					
			self.conn.commit()


		if len(not_archived) > 0:
			self.cur.executemany("""UPDATE show SET archived=0 WHERE "shotgunKey"='%(id)s' """, not_archived)
			self.conn.commit()
		
		print "// Done Updating Statuses //"



