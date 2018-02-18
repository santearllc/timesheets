#!/usr/bin/python

import psycopg2

class AF_Config():
	
	def __init__(self):

		# postgresql database 
		self.url ="atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
		self.user ="postgres"
		self.pw ="at0micp0stgr3z"
		self.db ="tss"

		# bambooHR 
		self.bamboo_api_key = 'da031971a86b4eda99989c58a4547c6477781eab'
		self.bamboo_subdomain = 'atomicfiction'

		# Shotgun 
		self.sg_api_key = 'dcf1592d61af6eee381717fec64cdbc81cbda8b941f068093745b1647e2a1c9e'
		self.sg_subdomain = 'atomicfiction'
		self.sg_script = 'time_sheets'

		# settings
		self.timezone = 'GMT'


	def db_conn(self):
		try:
			return psycopg2.connect("dbname='"+self.db+"' user='"+self.user+"' host='"+self.url+"' password='"+self.pw+"'")
		except:
			return False		