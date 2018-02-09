#!/usr/bin/python

# Notes:
# the TSS uses the word SHOW instead of PROJECT

import shotgun_api3
import psycopg2
import datetime




# Postgresql Database 
POSTGRES_URL = "atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
POSTGRES_USER = "tss_readWrite"
POSTGRES_PW = "at0micp0stgr3z"
POSTGRES_DB = "tss"


class TSS_Shotgun:
	def __init__(self):
	 	#self.script_auth()
	 	self.script_auth()
	 	self.conn = self.db_conn()

	def db_conn(self):
		try:
			return psycopg2.connect("dbname='"+str(POSTGRES_DB)+"' user='"+str(POSTGRES_USER)+"' host='"+str(POSTGRES_URL)+"' password='"+str(POSTGRES_PW)+"'")
		except:
			return False


	def script_auth(self):
		try:
			self.sg = shotgun_api3.Shotgun("https://atomicfiction.shotgunstudio.com",
                		    	    	  	script_name="time_sheets",
            	   	    	    	  	  	api_key="dcf1592d61af6eee381717fec64cdbc81cbda8b941f068093745b1647e2a1c9e")			
		except():
			return False;


	def get_projects(self, status):
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


	def sync_sg_to_tss(self):
		print "Syncing SG to TSS"

		cur = self.conn.cursor()

		projects = self.get_projects('Active')
		for p in projects:
			if p['id'] > 63: # skip the demo projects and templates
				print p['sg_description']

				data = {}
				data['showKey'] = p['id']
				data['showName'] = p['name']
				data['sg_description'] = p['sg_description']
				data['sgStatus'] = p['sg_status']
				
				
				# add project to database (only adds show if not currently in db)				
				cur.execute("""SELECT show."shotgunKey" FROM show WHERE show."shotgunKey"="""+str(p['id'])+""" LIMIT 1""")
				rows = cur.fetchall()

				if len(rows) <= 0:
					# add to database
					cur.execute("""INSERT INTO show ("shotgunKey", "showTitle", "showCode") VALUES ("""+str(p['id'])+""",'"""+p['sg_description']+"""','"""+p['name']+"""')""")
					self.conn.commit()

				# get showKey from tss database
				cur.execute("""SELECT show."showKey" FROM show WHERE show."shotgunKey"="""+str(p['id'])+""" LIMIT 1""")
				row = cur.fetchall()
				showKey = row[0][0]


				# get SHOTS associated with this project
				existing_shots = []
				cur.execute("""SELECT shot."shotgunKey" FROM shot WHERE shot."showKey"="""+str(showKey)+""" """)
				rows = cur.fetchall()

				for row in rows:
					existing_shots.append(row[0])

				shots_to_add = []
				shots = self.get_shots(p)

				for s in shots:
					data = {}
					data['showKey'] = showKey
					data['shotgunKey'] = s['id']
					data['shotTitle'] = s['code']

					# add shot to database (only adds show if not currently in db)
					if s['id'] not in existing_shots:
						shots_to_add.append(data)
				
				if len(shots_to_add) > 0 :
					cur.executemany("""INSERT INTO shot ("showKey","shotgunKey","shotTitle") VALUES (%(showKey)s, %(shotgunKey)s, %(shotTitle)s)""", shots_to_add)					
					self.conn.commit()


				# get ASSETS associated with this project
				existing_assets = []
				cur.execute("""SELECT asset."shotgunKey" FROM asset WHERE asset."showKey"="""+str(showKey)+""" """)

				rows = cur.fetchall()
				for row in rows:
					existing_assets.append(row[0])

				assets_to_add = []
				assets = self.get_assets(p)

				for a in assets:
					data = {}
					data['showKey'] = showKey
					data['shotgunKey'] = a['id']
					data['assetTitle'] = a['code']

					# add shot to database (only adds show if not currently in db)
					if a['id'] not in existing_assets:
						assets_to_add.append(data)

				if len(assets_to_add) > 0 :
					cur.executemany("""INSERT INTO asset ("showKey","shotgunKey","assetTitle") VALUES (%(showKey)s, %(shotgunKey)s, %(assetTitle)s)""", assets_to_add)					
					self.conn.commit()
	

	def update_statuses(self):
		print "updating status"


		# get current shows in database: 
		#cur.execute("""SELECT show."shotgunKey" FROM show WHERE show."shotgunKey"="""+str(p['id'])+""" LIMIT 1""")
		rows = cur.fetchall()

		if len(rows) <= 0:
			pass
			# add to database
			#cur.execute("""INSERT INTO show ("shotgunKey", "showTitle", "showCode") VALUES ("""+str(p['id'])+""",'"""+p['sg_description']+"""','"""+p['name']+"""')""")
			#self.conn.commit()

		projects = self.get_projects('all')
		for p in projects:
			print p
		


# run scripts every 30 mintues
# TSS_Shotgun().sync_sg_to_tss()
TSS_Shotgun().update_statuses()
