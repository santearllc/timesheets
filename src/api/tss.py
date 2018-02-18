#!/usr/bin/python

import requests, json
import datetime
import calendar
import psycopg2
import uuid
from config import AF_Config


class TSS():
	
	def __init__(self):
		self.conn = AF_Config().db_conn()
		self.cur = self.conn.cursor()
		self.export_data = {}

	def export_to_payroll(self, week_of):
		print "Exporting Payroll"
		
		self.cur.execute("""SELECT timesheet."timeSheetKey" FROM timesheet WHERE timesheet.status!=0 AND timesheet.status!=2 AND timesheet."weekOf"='"""+str(week_of)+"""';""")
		timesheets = self.cur.fetchall()

		for t in timesheets:
			print t
			timeSheetKey = t[0]
			self.cur.execute("""SELECT time."userKey", time.hours FROM time WHERE time."timeSheetKey"='"""+str(timeSheetKey)+"""';""")
			time = self.cur.fetchall()
			
			for t in time:
				if t[0] not in self.export_data:
					self.export_data[t[0]] = [0,0,0,0,0,0,0]

				if t[1] not in [None]:
					self.add_hours(t)
	
		print "data: "

		for x in self.export_data:
			print self.export_data[x]


	def sum_hours(self, hours):
		hours_sum = 0
		
		for h in hours: 
			hours_sum += h

		return hours_sum

	def add_hours(self, t):		
		for i, h in enumerate(t[1]):
			self.export_data[t[0]][i] += h
		





TSS().export_to_payroll('2018-01-29')