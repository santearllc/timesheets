#!/usr/bin/python

import requests, json
import datetime
import calendar
import psycopg2
import uuid
import csv
import re
import shutil
from config import AF_Config
import os


class TSS():
	
	def __init__(self):
		self.conn = AF_Config().db_conn()
		self.cur = self.conn.cursor()
		self.types = {'rt' : True, 'ot' : False, 'dt' : False, 'f' : False, 'h' : False, 'j' : False, 's' : False, 'v' : False}
		self.test_data = {}
		self.export_data = {}
		self.office_code = {}
		self.batch = '{:%Y%m%d%H%M%S}'.format(datetime.datetime.now())
		self.week_of = None
		self.export_path = '/var/www/html/export/_csv/'

		if os.path.isdir(self.export_path) is False:
			self.export_path = '../export/_csv/'

		self.get_office_adp_id()
		
		# Code/Hours order: Double Time, Vacation, Sick, Holiday, Jury Duty, Bereavement
		self.csv_template_labels = {'File #' : '', 'Last Name' : '', 'First Name' : '', 'Rate 1' : '', 'Regular Hours' : '', 'Overtime Hours' : '', 'Code_D' : '', 'Hours_D' : '', 'Code' : '',
							'Hours' : '', 'Code' : '', 'Hours' : '', 'Code' : '', 'Hours' : '', 'Code' : '', 'Hours' : '', 'Code' : '', 'Hours' : ''}

	def get_user_info(self, user_key):
		self.cur.execute("""SELECT adp, "firstName", "lastName" FROM public.user WHERE "userKey"="""+str(user_key)+""" LIMIT 1;""")
		user_info = self.cur.fetchall()

		for i in user_info:
			return i

	def get_users_by_week(self, week_of):
		self.cur.execute("""SELECT "userKey" FROM public.user_by_week WHERE "weekOf"='"""+str(week_of)+"""';""")
		users = self.cur.fetchall()

		incl = []

		# manually add info@santear.com during testing
		incl.append(str(22))

		for i in users:
			incl.append(str(i[0]))

		return '('+', '.join(incl)+')'

	def get_office_adp_id(self):
		self.offices = {}

		self.cur.execute("""SELECT "officeKey", adp FROM public.office;""")
		office_info = self.cur.fetchall()

		for i in office_info:
			self.offices[i[0]] = i[1]


	def export_to_payroll(self, week_of):

		# set week of
		self.week_of = week_of

		# create timesheet_export record for boths offices
		self.record_export_action(False)
		
		# get adp company code
		self.cur.execute("""SELECT office."officeKey", office.adp
							FROM office
						""")
		offices = self.cur.fetchall()

		for office in offices:
			self.office_code[office[0]] = office[1]

		users_to_incl = self.get_users_by_week(week_of)

		self.cur.execute("""SELECT timesheet."timeSheetKey", timesheet."officeKey", timesheet."userKey", timesheet."rateType" 
							FROM timesheet 
							WHERE "userKey" in """+users_to_incl+"""
								AND timesheet.status!=0
								AND timesheet.status!=2 
								AND timesheet."weekOf"='"""+str(week_of)+"""';
						""")

		timesheets = self.cur.fetchall()

		for timesheet in timesheets:
			
			#print timesheet
			user_info = self.get_user_info(timesheet[2])

			# set adp user key
			adp = user_info[0]

			# set rate type
			rate_type = timesheet[3]

			# if missing a rate type for any reason, then default to hourly
			if rate_type is None:
				rate_type = 'hourly'
			
			# add office to export_data dictionary
			if timesheet[1] not in self.export_data:
				self.export_data[timesheet[1]] = {}

			# add timesheet key to export_data dictionary
			if timesheet[0] not in self.export_data[timesheet[1]]:
				# self.export_data[timesheet[1]][timesheet[0]] = {'batch_id' : batch_id,'hours':[0,0,0,0,0,0,0], 'adp': adp, 'rateType' : rate_type, 'firstName' : user_info[1], 'lastName' : user_info[2], 'officeKey' : timesheet[1]}				
				self.export_data[timesheet[1]][timesheet[0]] = {'batch_id' : self.batch, 'by_day' : [[],[],[],[],[],[],[]], 'hours':[0,0,0,0,0,0,0], 'adp': adp, 'rateType' : rate_type, 'first_name' : user_info[1], 'last_name' : user_info[2], 'office_key' : timesheet[1]}

			# get time records specific to timesheet (only get approved line items)
			self.cur.execute("""SELECT time.hours, time.cat1, time.cat2, time.cat3 
								FROM time 
								WHERE time."approvedBy" IS NOT NULL 
									AND time."timeSheetKey"='"""+str(timesheet[0])+"""';
								""")

			time_lines = self.cur.fetchall()

			# loop through all of the time lines and determine code
			for t in time_lines:
				code = 'r' # Work, Training, Company Event, Down Time, Studio Closure. (If addig more codes, then the csv export func will have to be updated as well)
				if t[1] == 1:
					if t[3] in [1]: #'Bereavement'
						code = 'f'
					elif t[3] in [4]: #'Holiday'
						code = 'h'
					elif t[3] in [5]: #'Jury Duty'
						code = 'j'
					elif t[3] in [6]: #'Sick'
						code = 's'
					elif t[3] in [10]: #'Vacation'
						code = 'v'

				if t[0] not in [None] and not (t[1] == 1 and t[3] == 9): # needs to have recorded hours and not be an "Unpaid Time Off" entry					
					self.export_data[timesheet[1]][timesheet[0]]['by_day'] = self.by_day(self.export_data[timesheet[1]][timesheet[0]]['by_day'], t[0], code)

					if timesheet[0] in self.export_data[timesheet[1]]:
						self.export_data[timesheet[1]][timesheet[0]]['hours'] = self.sum_hours(self.export_data[timesheet[1]][timesheet[0]]['hours'], t[0])

		# loop through offices
		for office_key in self.export_data:
			# loop through users in each office
			for user in self.export_data[office_key]:

				#self.export_data[office_key][user]['bd'] = self.determine_breakdown(self.export_data[office_key][user], office_key)
				self.export_data[office_key][user]['bd'] = self.determine_breakdown(self.export_data[office_key][user], office_key)
				
				# clean up dictionary after processing hours
				del self.export_data[office_key][user]['hours']
				del self.export_data[office_key][user]['by_day']


		# data is ready to be exported to csv at this point
		self.to_csv(week_of)

		# update database to indicate that export is complete
		self.record_export_action(True)



	def by_day(self, in_arr, hours, code):
		for i, h in enumerate(hours):
			if h > 0.0:
				in_arr[i].append([h, code])
		
		return in_arr


	def sum_hours(self, in_arr, hours):
		out_arr = in_arr
		for i, h in enumerate(hours): 
			in_arr[i] += h

		return out_arr

	def determine_breakdown_DEPRECIATED(self, in_data, office_key):
		rt = 0.0
		ot = 0.0
		dt = 0.0

		ot_dict = {	0: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
					1: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}, 
					2: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}, 
					3: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}, 
					4: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}, 
					5: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}, 
					6: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0}
				  }

		

		if in_data['rateType'] in ['salary']:
			# both CAN and US have same rules applied for salaried employee:
			sum_hours = 0.0

			# sum hours for entire week
			for h in in_data['hours']:
				sum_hours += h

			# once all of the hours have been summed for the week see if they exceed 40, 
			# if they do then cap at 40 hours, else use actual hours
			if sum_hours > 40.0:
				rt = 40.0
			else: 
				rt = sum_hours

		else:			
			if office_key == 0: # OAK
				
				for i, h in enumerate(in_data['hours']):
					if h <= 8.0:
						ot_dict[i]['rt'] = h
					elif h <= 12:
						ot_dict[i]['rt'] = 8.0
						ot_dict[i]['ot'] = h - 8.0
					else:
						ot_dict[i]['rt'] = 8.0
						ot_dict[i]['ot'] = 4.0
						ot_dict[i]['dt'] = h - 12.0

				# sum ot_dict
				for i in ot_dict:
					for ot_type in ot_dict[i]:
						if ot_type == 'rt':
							rt += ot_dict[i][ot_type]
						elif ot_type == 'ot':
							ot += ot_dict[i][ot_type]
						else:
							dt += ot_dict[i][ot_type]

			else: # MON
				sum_hours = 0.0

				# go through each day's hours
				for i, h in enumerate(in_data['hours']):
					sum_hours += h

					# if the current day plus previous days hours is less than 40
					if (sum_hours) < 40.0:
						pass
						if sum_hours - h < 40:
							rt += h
					else:
						
						# if the day has a both rt and ot
						if (40.0 - (sum_hours - h)) > 0.0:
							rt += (40.0 - (sum_hours - h))
							ot += sum_hours - 40.0
						else: 
							ot += h

		return {'rt' : rt, 'ot' : ot, 'dt' : dt}

	def determine_breakdown(self, in_data, office_key):
		by_type = {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0, 'f' : 0.0, 'h' : 0.0, 'j' : 0.0, 's' : 0.0, 'v' : 0.0}
		h_type = {}
		ot_dict = {	0: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			1: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			2: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			3: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			4: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			5: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0},
		 			6: {'rt' : 0.0, 'ot' : 0.0, 'dt' : 0.0} 
		 			}			

		if in_data['rateType'] in ['salary']:
			# both CAN and US have same rules applied for salaried employee:
			sum_hours = 0.0

			# sum hours for entire week
			for h in in_data['hours']:
				sum_hours += h

			# once all of the hours have been summed for the week see if they exceed 40, 
			# if they do then cap at 40 hours, else use actual hours
			if sum_hours > 40.0:
				by_type['rt'] = 40.0
			else: 
				by_type['rt'] = sum_hours

			# check codes, if not regular time then deduct from sum of hours and add to the correct code sum. 
			for i, h in enumerate(in_data['by_day']):				
				for l in h: 
					if l[1] not in ['r']:
						# if has hours
						if l[0] > 0.0:
							# indicates that the code is used and will be included in the export
							self.types[l[1]] = True						
							by_type['rt'] -= l[0]
							by_type[l[1]] += l[0]
							
							# don't allow negative numbers
							if by_type['rt'] < 0.0:
								by_type['rt'] = 0.0

		else:			
			if office_key == 0: # OAK
							
				for i, h in enumerate(in_data['hours']):
					if h <= 8.0:						
						ot_dict[i]['rt'] = h
					elif h <= 12:
						ot_dict[i]['rt'] = 8.0
						ot_dict[i]['ot'] = h - 8.0
					else:
						ot_dict[i]['rt'] = 8.0
						ot_dict[i]['ot'] = 4.0
						ot_dict[i]['dt'] = h - 12.0

				
				# sum ot_dict
				for i in ot_dict:
					for ot_type in ot_dict[i]:
						if ot_type == 'rt':
							by_type['rt'] += ot_dict[i][ot_type]
						elif ot_type == 'ot':
							by_type['ot'] += ot_dict[i][ot_type]
						else:
							by_type['dt'] += ot_dict[i][ot_type]

				
				# check codes, if not regular time then deduct from sum of hours and add to the correct code sum. 

				for i, h in enumerate(in_data['by_day']):				
					for l in h:
						if l[1] not in ['r']:
							# if has hours
							if l[0] > 0.0:
								# indicates that the code is used and will be included in the export
								self.types[l[1]] = True
								by_type[l[1]] += l[0]

								if l[0] <= 8.0:
									by_type['rt'] -= l[0]									
								elif l[0] <= 12.0: 
									by_type['rt'] -= 8
									by_type['ot'] -= l[0] - 8
								else: 
									by_type['rt'] -= 8
									by_type['ot'] -= 4
									by_type['dt'] -= l[0] - 12

								# don't allow negative numbers
								if by_type['rt'] < 0.0:
									by_type['rt'] = 0.0
								if by_type['ot'] < 0.0:
									by_type['ot'] = 0.0
								if by_type['dt'] < 0.0:
									by_type['dt'] = 0.0

			else: # MON
				sum_hours = 0.0

				# go through each day's hours
				for i, h in enumerate(in_data['hours']):
					sum_hours += h

					# if the current day plus previous days hours is less than 40
					if (sum_hours) < 40.0:
						pass
						if sum_hours - h < 40:
							#rt += h
							by_type['rt'] += h
					else:
						# if the day has a both rt and ot
						if (40.0 - (sum_hours - h)) > 0.0:
							by_type['rt'] += (40.0 - (sum_hours - h))
							by_type['ot'] += sum_hours - 40.0
						else:
							by_type['ot'] += h

				# check codes, if not regular time then deduct from sum of hours and add to the correct code sum. 
				for i, h in enumerate(in_data['by_day']):				
					for l in h: 
						if l[1] not in ['r']:
							# if has hours
							if l[0] > 0.0:
								# indicates that the code is used and will be included in the export
								self.types[l[1]] = True
								by_type['rt'] -= l[0]
								by_type[l[1]] += l[0]

		return by_type

	def add_hours(self, t):
		for i, h in enumerate(t[1]):
			self.export_data[t[0]][i] += h

	def adp_to_int(self, adp_in):
		adp_out = adp_in

		if adp_in is not None:
			adp_out = int(re.sub('[^0-9]','', adp_in))
		else:
			adp_out = ''

		return adp_out


	def h_csv_f(self, hours_in, code=False): # hours for csv formatting
		hours_out = ','

		if code:  
			if hours_in > 0.0: 
				hours_out += code + ','				
			else:
				hours_out += ','

		if hours_in > 0.0:
			hours_out += str(hours_in)

		return hours_out

	def to_csv(self,week_of):
		
		# loop through offices
		for office_key in self.export_data:

			# set path for new csv file
			f_path = self.export_path+week_of+'_'+str(self.batch)+'_'+str(office_key)+'.csv'

			#copy template file
			shutil.copy2(self.export_path+'_template.csv', f_path)
			
			fd = open(f_path, 'a')

			# loop through users in each office
			for user in self.export_data[office_key]:
				line = self.export_data[office_key][user]
				
				csv_line = '%s,%s,%s,%s,%s' % (self.office_code[line['office_key']], line['batch_id'], self.adp_to_int(line['adp']), line['last_name'], line['first_name'])

				csv_line += self.h_csv_f(line['bd']['rt'])
				csv_line += self.h_csv_f(line['bd']['ot'])
				csv_line += self.h_csv_f(line['bd']['dt'], 'd')
				csv_line += self.h_csv_f(line['bd']['s'], 's')
				csv_line += self.h_csv_f(line['bd']['v'], 'v')
				csv_line += self.h_csv_f(line['bd']['h'], 'h')
				csv_line += self.h_csv_f(line['bd']['j'], 'j')
				csv_line += self.h_csv_f(line['bd']['f'], 'f')


				fd.write("""%s\n""" % csv_line)
		
			fd.close()


	def record_export_action(self, end=False):
		executed_on = '{:%Y-%m-%d}'.format(datetime.datetime.now())

		if end:
			self.cur.execute("""UPDATE public.timesheet_export SET status=1 WHERE batch='%s'""" % (self.batch))
			self.conn.commit()
		else:
			# USA
			self.cur.execute("""INSERT INTO public.timesheet_export (batch, status, "officeKey", "weekOf", path, "executedOn", "executedBy") VALUES('%s','%s','%s','%s','%s','%s','%s')""" % (self.batch,0,0,self.week_of,str('/export/_csv/'+self.week_of+'_'+self.batch+'_0.csv'),executed_on,22))
			self.conn.commit()
			
			# CAN
			self.cur.execute("""INSERT INTO public.timesheet_export (batch, status, "officeKey", "weekOf", path, "executedOn", "executedBy") VALUES('%s','%s','%s','%s','%s','%s','%s')""" % (self.batch,0,1,self.week_of,str('/export/_csv/'+self.week_of+'_'+self.batch+'_1.csv'),executed_on,22))
			self.conn.commit()




#TSS().export_to_payroll('2018-01-29')