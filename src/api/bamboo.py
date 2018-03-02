#!/usr/bin/python

import requests, json
import datetime
import calendar
import psycopg2
import uuid
from config import AF_Config


class Bamboo:

	def __init__(self):
		self.conn = AF_Config().db_conn()
		self.cur = self.conn.cursor()

	 	self.api_key = AF_Config().bamboo_api_key
		self.subdomain = AF_Config().bamboo_subdomain
		self.headers = {'accept': 'application/json'}

	def get_users(self):
		page = requests.get('http://api.bamboohr.com/api/gateway.php/'+self.subdomain+'/v1/employees/directory', headers=self.headers, auth=requests.auth .HTTPBasicAuth(self.api_key, 'x'))
		
		try: 
			users = json.loads(page.text)
			return users['employees']
		except TypeError:
			return False

	def get_user_rate_info(self,user_key):
		page = requests.get('http://api.bamboohr.com/api/gateway.php/'+self.subdomain+'/v1/employees/'+str(user_key)+'/tables/compensation', headers=self.headers, auth=requests.auth .HTTPBasicAuth(self.api_key, 'x'))
		
		try:
			comp_list = json.loads(page.text)
			# get the last entry in the list			
			return comp_list[len(comp_list)-1]
		except TypeError:
			return False	

	def get_user_info(self,user_key,attributes):
		page = requests.get('http://api.bamboohr.com/api/gateway.php/'+self.subdomain+'/v1/employees/'+str(user_key)+'?fields='+','.join(attributes), headers=self.headers, auth=requests.auth .HTTPBasicAuth(self.api_key, 'x'))
		
		try:
			return json.loads(page.text)
		except TypeError:
			return False	

	def get_user_byEmail(self, email):
		users = self.get_users()

		if users: 
			for user in users:
				if user['workEmail'] in [email]:
					return user
		
		return False

	def get_user_status(self, id):
		print "get user status"
		
		page = requests.get('http://api.bamboohr.com/api/gateway.php/'+self.subdomain+'/v1/employees/'+str(id)+'?fields=status', headers=self.headers, auth=requests.auth .HTTPBasicAuth(self.api_key, 'x'))

		try: 
			return json.loads(page.text)
		except TypeError:
			return False

	def get_departments(self):
		departments_by_name = {}
		departments_by_key = {}

		self.cur.execute("""SELECT * FROM public.department""")
		data = self.cur.fetchall()
		
		for d in data:
			departments_by_name[d[1]] = d[0]
			departments_by_key[d[0]] = d[1]

		return [departments_by_name, departments_by_key]


	def add_department(self, departmentTitle):
		# add department to tss database and return new departmentKey

		self.cur.execute("""INSERT INTO department ("departmentTitle") VALUES ('"""+str(departmentTitle)+"""')""")
		self.conn.commit()
		
		# get departmentKey of new row
		self.cur.execute("""SELECT department."departmentKey" FROM department WHERE department."departmentTitle"='"""+str(departmentTitle)+"""' LIMIT 1""")
		row = self.cur.fetchall()

		return row[0]


	def sync(self):
		print "// Syncing Bamboo and TSS //"
		
		# determine current weekOf 
		today = datetime.datetime.today()
		cur_day = datetime.datetime.today().weekday()	
		week_of = today - datetime.timedelta(days=(cur_day))
		week_of = week_of.strftime('%Y-%m-%d')

		# get users in the current week of tss database table
		self.cur.execute("""SELECT user_by_week."userKey" FROM user_by_week WHERE user_by_week."weekOf"='"""+week_of+"""'  """)
		users = self.cur.fetchall()

		week_of_users = []
		for user in users:
			# tss userKey
			week_of_users.append(int(user[0]))

		# get ALL users currently in the tss database table
		self.cur.execute("""SELECT public.user."userKey", public.user."bambooKey", public.user."email" FROM public.user""")
		users = self.cur.fetchall()

		tss_users = {}
		for user in users:
			# bambooKey
			tss_users[int(user[1])] = user

	
		# get departments in tss database
		departments = self.get_departments()
		departments_by_name = departments[0]
		
		# get bamboo users in the current directory listing
		user_data = self.get_users()

		user_keys = []
		missing_user_keys = []
		
		# loop through all bamboo users (if their in this list it means they are active)
		for user in user_data:
			if user['workEmail']:
				user_data = {}
				user_data['bambooKey'] = user['id']
				user_data['email'] = user['workEmail']				
				user_data['firstName'] = user['firstName']
				user_data['lastName'] = user['lastName']
				user_data['adp'] = self.get_user_info(user['id'], ["employeeNumber"])["employeeNumber"]


				# update current rate type selection
				rate = self.get_user_rate_info(user['id'])['type']

				if rate.lower() in ['salary', 'hourly']:
					user_data['rateType'] = rate.lower()
				else:
					user_data['rateType'] = 'hourly'

				# determine department
				if user['department'] in departments_by_name:
					user_data['departmentKey'] = departments_by_name[user['department']]
				else: 
					# add department to tss database
					department_key = self.add_department(user['department'])
					user_data['departmentKey'] = department_key

					# add new department_key to departments_by_name dictionary
					departments_by_name[user['department']] = department_key

				# set location (0 = US, 2 = Canada)
				if user['location'] in ['Canada']:
					user_data['officeKey'] = 1
				else: 
					user_data['officeKey'] = 0
				
				# set tss_userKey if in the tss_users dictionary; otherwise add the user
				if int(user['id']) in tss_users:
					tss_userKey = tss_users[int(user['id'])][0]
				else: 
					# create random userKeyPublic
					userKeyPublic = str(uuid.uuid4())

					# add user to the tss database
					self.cur.execute("""INSERT INTO public.user ("userKeyPublic","bambooKey","firstName","lastName","email","departmentKey", "officeKey") VALUES (%s, %s, %s, %s, %s, %s, %s);""", 
						(userKeyPublic, user_data['bambooKey'], user_data['firstName'], user_data['lastName'], user_data['email'], user_data['departmentKey'], user_data['officeKey']))					
					self.conn.commit()
					
					# get userkey for just added user
					self.cur.execute("""SELECT public.user."userKey" FROM public.user WHERE public.user."bambooKey"="""+user_data['bambooKey']+""" LIMIT 1""")
					tss_userKey = self.cur.fetchall()[0][0]

				# if the user is not in the week of table then add user
				if tss_userKey not in week_of_users:
					missing_user_keys.append({'id' : tss_userKey, 'week_of' : week_of})

				# update rate and adp id in tss user table
				self.cur.execute("""UPDATE public.user SET "rateType"=%s, adp=%s WHERE "userKey"=%s;""", 
					(user_data['rateType'], user_data['adp'], tss_userKey))
				self.conn.commit()					

				# add to list and to dictionary
				user_keys.append(str(tss_userKey))
			

		# add missing users from the user_week_of table back to table
		self.cur.executemany("""INSERT INTO user_by_week ("userKey","weekOf") VALUES (%(id)s, %(week_of)s)""", missing_user_keys)
		self.conn.commit()

		# delete users in the current week of tss database table that shouldn't be in it
		if len(user_keys) > 0:
			user_filter = '(user_by_week."userKey"!='+ ' AND user_by_week."userKey"!='.join(user_keys)+ """) AND user_by_week."weekOf"='"""+week_of+"""';"""
			self.cur.execute("""DELETE FROM user_by_week WHERE """+user_filter)
			self.conn.commit()
		
		print "// Done Syncing Bamboo and TSS //"


#Bamboo().sync()


# this person is salary 
#rate = Bamboo().get_user_rate_info(350)
#print rate


# this person is hourly 
#rate = Bamboo().get_user_rate_info(483)



