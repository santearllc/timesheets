#!/usr/bin/python

class AF_TSS():
	def __init__(self):
	 	
		# postgresql database 
		self.postgres_url ="atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
		self.postgres_user ="postgres"
		self.postgres_pw ="at0micp0stgr3z"
		self.postgres_db ="tss"
	 	
	 	# bambooHR 
	 	self.api_key = 'da031971a86b4eda99989c58a4547c6477781eab'
		self.subdomain = 'atomicfiction'

		# settings
		self.timezone = 'GMT'

	def db(self):
		DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

		







