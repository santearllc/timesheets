#!/usr/bin/python

from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy

import uuid
import datetime
import os
from google.oauth2 import id_token
from google.auth.transport import requests as requests_goog

from bamboo import Bamboo
import urllib2, urllib

app = Flask(__name__)

# Postgresql Database 
POSTGRES_URL = "atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
POSTGRES_USER = "postgres"
POSTGRES_PW = "at0micp0stgr3z"
POSTGRES_DB = "tss"


DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

os.environ['TZ'] = 'GMT'

db = SQLAlchemy(app)

class Session(db.Model):
	sessionKey = db.Column(db.Integer, primary_key=True)
	session = db.Column(db.String(50))
	userKey = db.Column(db.Integer)
	sub = db.Column(db.String(500))
	token = db.Column(db.Text)
	createdOn = db.Column(db.DateTime)	

class User(db.Model):
	userKey = db.Column(db.Integer, primary_key=True)
	userKeyPublic = db.Column(db.String(50), unique=True)
	email = db.Column(db.String(50))
	firstName = db.Column(db.String(50))
	lastName = db.Column(db.String(50))
	officeKey = db.Column(db.Integer)
	sub = db.Column(db.String(500))
	bambooKey = db.Column(db.Integer)
	departmentKey = db.Column(db.Integer)

class UserByWeek(db.Model):
	UserByWeekKey = db.Column(db.Integer, primary_key=True)
	userKey = db.Column(db.Integer)
	weekOf = db.Column(db.Date)

class Time(db.Model):
	timeKey = db.Column(db.Integer, primary_key=True)	
	timeSheetKey = db.Column(db.Integer)
	userKey = db.Column(db.Integer)
	cat1 = db.Column(db.Integer)
	cat2 = db.Column(db.Integer)
	cat3 = db.Column(db.Integer)
	cat4 = db.Column(db.Integer)
	cat5 = db.Column(db.Integer)
	hours = db.Column(db.JSON)
	note = db.Column(db.Text)
	approvedBy = db.Column(db.Integer)
	approvedOn = db.Column(db.DateTime)
	rejectedBy = db.Column(db.Integer)
	rejectedOn = db.Column(db.DateTime)
	rejectedNote_artist = db.Column(db.Text)
	rejectedNote_department = db.Column(db.Text)	
	ip = db.Column(db.Text)

class Timesheet(db.Model):
	timeSheetKey = db.Column(db.Integer, primary_key=True)	
	userKey = db.Column(db.Integer)
	status = db.Column(db.Integer)
	updatedBy = db.Column(db.Integer)
	updatedOn = db.Column(db.DateTime)	
	weekOf = db.Column(db.Date)
	officeKey = db.Column(db.Integer)

class OvertimeSelect(db.Model):
	overtimeKey = db.Column(db.Integer, primary_key=True)
	timeSheetKey = db.Column(db.Integer)
	cat1 = db.Column(db.Integer)
	cat2 = db.Column(db.Integer)
	day = db.Column(db.JSON)

class Show(db.Model):
	showKey = db.Column(db.Integer, primary_key=True)
	shotgunKey = db.Column(db.Integer)
	showTitle = db.Column(db.String(50))
	showCode = db.Column(db.String(50))
	archived = db.Column(db.Integer)

class Department(db.Model):
	departmentKey = db.Column(db.Integer, primary_key=True)
	departmentTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)

class ShowTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class ShotTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class AssetTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class ProductionTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class SupervisionTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class DepartmentTask(db.Model):
	catKey = db.Column(db.Integer, primary_key=True)
	taskTitle = db.Column(db.String(50))
	archived = db.Column(db.Boolean)
	orderBy = db.Column(db.Integer)

class Asset(db.Model):
	assetKey = db.Column(db.Integer, primary_key=True)
	shotgunKey = db.Column(db.Integer)
	showKey = db.Column(db.Integer)
	assetTitle = db.Column(db.String(50))
	assetCode = db.Column(db.String(50))

class Shot(db.Model):
	shotKey = db.Column(db.Integer, primary_key=True)
	shotgunKey = db.Column(db.Integer)
	showKey = db.Column(db.Integer)
	shotTitle = db.Column(db.String(50))
	shotCode = db.Column(db.String(50))

class Delegator(db.Model):
	delegatorKey = db.Column(db.Integer, primary_key=True)
	userKey_delegate = db.Column(db.Integer)
	userKey = db.Column(db.Integer)
	createdBy = db.Column(db.Integer)
	createdOn = db.Column(db.DateTime)

class Approver(db.Model):
	approverKey = db.Column(db.Integer, primary_key=True)
	userKey = db.Column(db.Integer)
	cat1 = db.Column(db.Integer)
	cat2 = db.Column(db.Integer)
	createdBy = db.Column(db.Integer)
	createdOn = db.Column(db.DateTime)	

class Login(db.Model):
	loginKey = db.Column(db.Integer, primary_key=True)
	userKey = db.Column(db.Integer)
	loginOn = db.Column(db.DateTime)
	ipAddress = db.Column(db.DateTime)
	userAgent = db.String(db.Text)

class Office(db.Model):
	officeKey = db.Column(db.Integer, primary_key=True)
	officeKeyPublic = db.Column(db.String(50), unique=True)
	label = db.Column(db.String(50))
	description = db.Column(db.Text)

class UserOfficeHistory(db.Model):
	userOfficeHistoryKey = db.Column(db.Integer, primary_key=True)
	officeKey = db.Column(db.Integer)
	userKey = db.Column(db.Integer)
	asOf = db.Column(db.Date)

class PayrollPeriod(db.Model):
	payPeriodKey = db.Column(db.Integer, primary_key=True)
	periodStart = db.Column(db.Date)
	payPeriodStatus = db.Column(db.Integer)
	# payPeriodStatus options: 
	# 1 = open (allows for approvals, rejections, submissions to be made)
	# 2 = soft lock (locks out all users from changing timesheet entries)
	# 3 = hard lock (only db admin can unlock via sql)
	updatedBy = db.Column(db.Integer)
	updatedOn = db.Column(db.Date)


class Action(db.Model):
	actionKey = db.Column(db.Integer, primary_key=True)
	script = db.Column(db.Text)
	functionName = db.Column(db.Text)
	description = db.Column(db.Text)
	active = db.Column(db.Boolean)
	executedOn = db.Column(db.Date)
	executedBy = db.Column(db.Integer)
	status = db.Column(db.Integer)


class ActionHistory(db.Model):
	actionHistoryKey = db.Column(db.Integer, primary_key=True)
	script = db.Column(db.Text)
	executedOn = db.Column(db.Date)
	executedBy = db.Column(db.Integer)
	status = db.Column(db.Integer)


class WeekStart(db.Model):
	weekStartKey = db.Column(db.Integer, primary_key=True)
	createdBy = db.Column(db.Integer)
	createdOn = db.Column(db.DateTime)
	weekOf = db.Column(db.Date)
	newStart = db.Column(db.Date)
	

# Uncomment two lines below if adding new model (Table) to db.  Note: If you modify a model 
# above it will not get updated when running create_all(). You must update column in dbms or via sql. 

#db.create_all()
#db.session.commit()

### User Functions ###
@app.route('/timesheets/status/<week_of>', methods=['GET'])
def get_time_sheet_status_all_users(week_of):
	users = User.query.order_by(User.lastName).all()
	output = []
	shows_rec = []
	departments_rec = []
	

	for user in users:
		user_data = {}
		user_data['fullName'] = user.firstName + ' ' + user.lastName
		user_data['fullName_r'] = user.lastName + ', ' + user.firstName
		user_data['firstName'] = user.firstName
		user_data['lastName'] = user.lastName
		user_data['officeKey'] = user.officeKey
		user_data['timeSheetStatus'] = 0
		user_data['worked'] = []

		timesheet = Timesheet.query.filter_by(weekOf=week_of, userKey=user.userKey).first()
		if timesheet: 
			user_data['timeSheetStatus'] = timesheet.status

			# see if partially approved or fully, or neither
			if timesheet.status == 1:
				approved = 0
				total = 0
				lines = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
				for line in lines:
					total += 1
					if line.approvedBy > 0:
						approved += 1

				if approved == 0:
					user_data['timeSheetStatus'] = 1
				elif approved == total:
					user_data['timeSheetStatus'] = 4
				elif approved < total:
					user_data['timeSheetStatus'] = 3
			
			
			time = db.session.query(Time.cat1, Time.cat2).distinct().filter_by(timeSheetKey=timesheet.timeSheetKey).order_by(Time.cat1).all()
			
			for t in time:
				if t.cat2:
					user_data['worked'].append([t.cat1,t.cat2])

					if t.cat1 == 0:
						if t.cat2 not in shows_rec:
							shows_rec.append(t.cat2)
					else:
						if t.cat2 not in departments_rec:
							departments_rec.append(t.cat2)

		output.append(user_data)

	titles = {}

	# get show titles
	shows_rec_titles = {}
	for showKey in shows_rec:
		show = Show.query.filter_by(showKey=showKey).first()
		titles['0_'+str(showKey)] = show.showTitle

	# get dept titles
	departments_rec_titles = {}
	for departmentKey in departments_rec:
		department = Department.query.filter_by(departmentKey=departmentKey).first()
		titles['1_'+str(departmentKey)] = department.departmentTitle

	return jsonify({'users' : output, 'shows' : shows_rec_titles, 'departments' : departments_rec_titles, 'titles' : titles})



@app.route('/user/validate', methods=['POST'])
def vailidate_user():
	# validates id_token generated by google on the client with oauth2.
	data = request.get_json()

	token = data['id_token']
	args = request.args.to_dict()

	try:
	    idinfo = id_token.verify_oauth2_token(token, requests_goog.Request(), '697253707156-snm8bjc71kb1i7qac4goakajkr53f1m5.apps.googleusercontent.com')

	    if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
	        return jsonify({'valid' : False, 'id_token' : token, 'message' : 'Invalid Google Login'})

	    # check if the email address for the person logging on is in the BambooHR system; If not, then don't allow access
	    bamboo = Bamboo().get_user_byEmail(idinfo['email'])

	    if not bamboo:
			# return jsonify({'valid' : False, 'id_token' : token, 'message' : 'Email address ('+idinfo['email']+') is not registered in BambooHR. Contact your supervisor to correct.'})
			# the following line is temporary while testing for people not in bamboo,
			# otherwise the return should be used.

			bamboo = Bamboo().get_user_byEmail('info@santear.com')
			# return jsonify({'valid' : False, 'id_token' : token, 'message' : 'Email address ('+idinfo['email']+') is not registered in BambooHR. Contact your supervisor to correct.'})


	    # ID token is valid. Get the user's Google Account ID from the decoded token.
	    sub = idinfo['sub']
	    user_data = {}
	    user_data['email'] = idinfo['email']
	    user_data['firstName'] = idinfo['given_name']
	    user_data['lastName'] = idinfo['family_name']

	    
	    # determine department based off of Bamboo
	    department = Department.query.filter_by(departmentTitle=bamboo["department"]).first()

	    if not department:
			# defaults to production if no department is found (we should discuss this default)
			user_data['departmentKey'] = 17
	    else:
			user_data['departmentKey'] = department.departmentKey


		# determine office based off of Bamboo
	    if bamboo['location'] in ["Canada"]:
			user_data['officeKey'] = 1
	    else: 
			# otherwise defaults to USA
			user_data['officeKey'] = 0

	    
	    user_data['sub'] = idinfo['sub']
	    user_data['bambooKey'] = bamboo['id']
	    userKey = add_validated_user(user_data)
	    access = user_access(userKey)

	    session = str(uuid.uuid4())
	    add_session(userKey, session, token, sub)
	    userKey = get_user_public_key(userKey)

	    

	    return jsonify({'valid' : True, 'session' : session,  'id_token' : token, 'sub' : sub, 'email' : idinfo['email'], 'firstName' : idinfo['given_name'], 'lastName' : idinfo['family_name'], 'userKey' : userKey, 'data': data, 'department' : user_data['departmentKey'], 'access' : access})
	except ValueError:
	    # Invalid token 
	    return jsonify({'valid' : False, 'id_token' : token, 'message' : 'Session expired... redirecting to sign in page.'})


def add_session(userKey, session, token, sub):
	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
	
	old_sessions = Session.query.filter_by(userKey=userKey).all()
	
	for old_session in old_sessions:
		db.session.delete(old_session)
		db.session.commit()

	new_session = Session(session=session,userKey=userKey,token=token,sub=sub,createdOn=timestamp)
	db.session.add(new_session)
	db.session.commit()

def get_session(session, sub):
	session_res = Session.query.filter_by(session=session,sub=sub).first()

	session_data = {}
	session_data['session'] = session_res.session
	session_data['userKey'] = session_res.userKey
	session_data['token'] = session_res.token
	session_data['sub'] = str(session_res.sub)
	return session_data


def add_validated_user(data):
	user = User.query.filter_by(email=data["email"]).first()

	# only add a user if they aren't in the tss database; otherwise update office and department to latest bamboo settings
	if not user:
		userKeyPublic = str(uuid.uuid4())
		new_user = User(userKeyPublic=userKeyPublic, email=data['email'], firstName=data['firstName'], lastName=data['lastName'], officeKey=data["officeKey"], sub=data["sub"], bambooKey=data['bambooKey'], departmentKey=data['departmentKey'])
		db.session.add(new_user)
		db.session.commit()
		return get_user_private_key(userKeyPublic)
	else:
		User.query.filter_by(email=data["email"]).update({'sub' : data['sub'],'officeKey' : data['officeKey'], 'departmentKey' : data['departmentKey'], 'firstName' : data['firstName'], 'lastName' : data['lastName']})
		db.session.commit()
		return user.userKey


def user_access(userKey):
	# set access levels for user
	# 1 = sign out (true for all users)
	# 1 = entry
	# 2 = approvals
	# 3 = timesheet peek (see what people have on their time sheets that aren't submitted)
	# 4 = status
	# 5 = export
	# 6 = admin

	data = {0 : True, 1 : True, 2 : False, 3 : False, 4 : False, 5 : False, 6 : False}

	if userKey in [22]:
		data = {0 : True, 1 : True, 2 : True, 3 : True, 4 : True, 5 : True, 6 : True}		

	return data

@app.route('/user', methods=['GET'])
def get_all_users():
	users = User.query.all()
	output = []

	for user in users:
		user_data = {}
		user_data['public_key'] = user.userKeyPublic
		user_data['email'] = user.email
		user_data['fullName'] = user.firstName + ' ' + user.lastName
		user_data['fullName_r'] = user.lastName + ', ' + user.firstName
		user_data['firstName'] = user.firstName
		user_data['lastName'] = user.lastName
		user_data['officeKey'] = user.officeKey
		user_data['timesheetStatus'] = -1
		user_data['otSel'] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
		user_data['data'] = {}		
		user_data['data']['ot_assignment'] = None
		user_data['data']['totalHours'] = 0
		user_data['data']['totalHours_byDay'] = {}
		user_data['data']['totalHours_byDay']['t'] = [0,0,0,0,0,0,0,0]
		user_data['data']['totalHours_byDay']['rt'] = [0,0,0,0,0,0,0,0]
		user_data['data']['totalHours_byDay']['ot'] = [0,0,0,0,0,0,0,0]
		user_data['data']['totalHours_byDay']['dt'] = [0,0,0,0,0,0,0,0]

		output.append(user_data)

	return jsonify({'users' : output})




@app.route('/user/<public_key>', methods=['GET'])
def get_one_user(public_key):
	user = User.query.filter_by(userKeyPublic=public_key).first()

	if not user:
		return jsonify({'message' : 'no user found'})

	user_data = {}
	user_data['public_key'] = user.userKeyPublic
	user_data['email'] = user.email
	user_data['fullName'] = user.firstName + ' ' + user.lastName
	user_data['fullName_r'] = user.lastName + ', ' + user.firstName
	user_data['firstName'] = user.firstName
	user_data['lastName'] = user.lastName
	user_data['officeKey'] = user.officeKey
	user_data['timesheetStatus'] = 1
	user_data['otSel'] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
	user_data['data'] = {}
	user_data['data']['totalHours'] = 0
	user_data['data']['totalHours_byDay'] = {}
	user_data['data']['totalHours_byDay']['t'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['rt'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['ot'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['dt'] = [0,0,0,0,0,0,0,0]

	return jsonify({'user' : user_data})

@app.route('/user', methods=['POST'])
def create_user():
	data = request.get_json()
	new_user = User(userKeyPublic=str(uuid.uuid4()), email=data['email'], firstName=data['firstName'], lastName=data['lastName'], officeKey=data["officeKey"])
	db.session.add(new_user)
	db.session.commit()
	return jsonify({'message' : 'new user created!'})


@app.route('/user/<public_key>', methods=['DELETE'])
def delete_user(public_key):
	user = User.query.filter_by(userKeyPublic=public_key).first()

	if not user:
		return jsonify({'message' : 'no user found'})

	db.session.delete(user)
	db.session.commit()
	
	return jsonify({'message' : 'the user has been deleted'})


def get_user_private_key(userKeyPublic):
	user = User.query.filter_by(userKeyPublic=userKeyPublic).first()
	if not user:
		return False

	return user.userKey

def get_user_public_key(userKey):
	user = User.query.filter_by(userKey=userKey).first()
	if not user:
		return False

	return user.userKeyPublic


def get_user_name(userKey):

	user = User.query.filter_by(userKey=userKey).first()
	if not user:
		return 'name not set'

	return user.firstName + ' '	+ user.lastName


### Timesheet Functions ###
 
@app.route('/timesheets/<week_of>', methods=['GET'])
def get_time_sheets_all_users(week_of):
	args = request.args.to_dict()
	status = 1
	try:
		if 'status' in args:
			status = args['status']
	except():
		status = 1


	timesheets_arr = []
	lines_out = []
	overtime_sel = {}
	rejections = {}
	approvals = {}
	
	# select timesheet; see if there is a timesheet for the current week for the user
	timesheets = Timesheet.query.filter_by(weekOf=week_of).filter(Timesheet.status >= status).all()

	for timesheet in timesheets:
		ot_sel = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]

		lines = OvertimeSelect.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
		lines_out = []
		for line in lines: 
			ot_sel[line.day] = [line.cat1,line.cat2]

		userKey = get_user_public_key(timesheet.userKey)
		overtime_sel[userKey] = ot_sel

		timesheet_data = {}
		timesheet_data['timeSheetKey'] = timesheet.timeSheetKey
		timesheet_data['userKey'] = userKey
		timesheet_data['status'] = timesheet.status
		timesheets_arr.append(timesheet_data)

	for timesheet in timesheets_arr:

		# get time rows 
		lines = Time.query.filter_by(timeSheetKey=timesheet['timeSheetKey']).all()
		
		for line in lines: 
			userKey = get_user_public_key(line.userKey)

			line_data = {}
			line_data['timeKey'] = line.timeKey
			line_data['timeSheetKey'] = line.timeSheetKey
			line_data['userKey'] = userKey
			line_data['cat_1'] = line.cat1
			line_data['cat_2'] = line.cat2
			line_data['cat_3'] = line.cat3
			line_data['cat_4'] = line.cat4
			line_data['cat_5'] = line.cat5
			line_data['hours'] = line.hours
			line_data['note'] = line.note

			if line.approvedBy > 0: 
				if line.cat1 == 1 :
					index = str(line.cat1)+'_'+str(line.cat2)+'_'+str(line.cat3)+'_'+userKey					
				else: 
					index = str(line.cat1)+'_'+str(line.cat2)+'_'+userKey

				approvals[index] = {}
				approvals[index]['approved_on'] = line.approvedOn
				approvals[index]['approved_by'] = get_user_name(line.approvedBy)

			# rejection of a single line item will force the entire time sheet to be rejected
			if line.rejectedBy > 0 :
				rejections[userKey] = {}
				rejections[userKey]['rejected_on'] = line.rejectedOn
				rejections[userKey]['rejected_by'] = get_user_name(line.rejectedBy)
				rejections[userKey]['rejectedNote_artist'] = line.rejectedNote_artist
				rejections[userKey]['rejectedNote_department'] = line.rejectedNote_department
				rejections[userKey]['show_dept_name'] = get_show_title(line.cat2) if line.cat1 == 0 else get_department_title(line.cat2) + ': ' + get_departmentTask_title(line.cat3)

			lines_out.append(line_data)

	return jsonify({'message' : 'Time Sheets have been collected', 'timesheets' : timesheets_arr, 'lines' : lines_out, 'ot_sel' : overtime_sel, 'rejections' : rejections, 'approvals' : approvals, 'status' : str(status)})


def get_show_title(showKey):
	show = Show.query.filter_by(showKey=showKey).first()
	return show.showTitle

def get_department_title(departmentKey):
	department = Department.query.filter_by(departmentKey=departmentKey).first()
	return department.departmentTitle

def get_departmentTask_title(catKey):
	departmentTask = DepartmentTask.query.filter_by(catKey=catKey).first()
	return departmentTask.taskTitle	


@app.route('/timesheet', methods=['GET'])
def get_user_timesheet():
	args = request.args.to_dict()

	data = {}	

	data['weekStart'] = args['weekStart']
	ot_sel = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]
	rejections = {}
	session_data = get_session(args['session'], args['sub'])
	userKey = session_data['userKey']
	data['userKey'] = userKey
	data['auto_generated_time_sheet'] = False


	# select timesheet; see if there is a timesheet for the current week for the user
	timesheet = Timesheet.query.filter_by(weekOf=data['weekStart'], userKey=data['userKey']).first()
	
	# if there is then see if there are lines associated with it
	if timesheet:
		lines = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
		# if there are no lines associated with it then delete the timesheet to start over
		if not lines:
			db.session.delete(timesheet)
			db.session.commit()
			timesheet = None
	
	if not timesheet:
		# select timesheet
		timesheet = Timesheet.query.filter(Timesheet.weekOf <= data['weekStart'], Timesheet.userKey == data['userKey']).order_by(Timesheet.weekOf.desc()).first()
		timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())

		new_timesheet = Timesheet(userKey=str(userKey), weekOf=args['weekStart'], status=1, updatedOn=timestamp, updatedBy=userKey)
		# db.session.add(new_timesheet)
		# db.session.commit()
		# db.session.flush()

		data['status'] = 0
		data['existing'] = False		
		data['updatedOn'] = False

		if not timesheet:			
			lines_out = []
		else:			
			data['existing'] = False
			data['auto_generated_time_sheet'] = True
			data['updatedOn'] = timesheet.updatedOn

			# get time rows 
			lines = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
			lines_out = []
			for line in lines: 
				line_data = {}
				line_data['timeKey'] = line.timeKey
				line_data['userKey'] = line.userKey			
				line_data['cat_1'] = line.cat1
				line_data['cat_2'] = line.cat2
				line_data['cat_3'] = line.cat3
				line_data['cat_4'] = line.cat4
				line_data['cat_5'] = line.cat5
				line_data['hours'] = [0,0,0,0,0,0,0]
				line_data['note'] = ''
				line_data['approvedBy'] = None
				line_data['approvedOn'] = None
				line_data['rejectedBy'] = None
				line_data['rejectedOn'] = None
				line_data['rejectedNote_artist'] = None
				line_data['rejectedNote_department'] = None
				lines_out.append(line_data)


	else:
		data['existing'] = True
		data['timeSheetKey'] = timesheet.timeSheetKey
		data['status'] = timesheet.status
		data['updatedOn'] = timesheet.updatedOn

		lines = OvertimeSelect.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
		lines_out = []
		for line in lines: 
			ot_sel[line.day] = [line.cat1,line.cat2]


		# get time rows 
		lines = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
		lines_out = []
		for line in lines: 
			line_data = {}
			line_data['timeKey'] = line.timeKey
			line_data['timeSheetKey'] = line.timeSheetKey
			line_data['userKey'] = line.userKey
			line_data['cat_1'] = line.cat1
			line_data['cat_2'] = line.cat2
			line_data['cat_3'] = line.cat3
			line_data['cat_4'] = line.cat4
			line_data['cat_5'] = line.cat5
			line_data['hours'] = line.hours
			line_data['note'] = line.note
			line_data['approvedBy'] = line.approvedBy
			line_data['approvedOn'] = line.approvedOn
			line_data['rejectedBy'] = line.rejectedBy
			line_data['rejectedOn'] = line.rejectedOn
			line_data['rejectedNote_artist'] = line.rejectedNote_artist
			line_data['rejectedNote_department'] = str(line.rejectedNote_department)
			lines_out.append(line_data)

			# rejection of a single line item will force the entire time sheet to be rejectedBy
			if line.rejectedBy > 0 :
				if line.cat1 == 0 :
					key = str(line.cat1)+'_'+str(line.cat2)
				else :
					key = str(line.cat1)+'_'+str(line.cat2)+'_'+str(line.cat3)

				rejections[key] = {}

				rejections[key]['rejected_on'] = line.rejectedOn
				rejections[key]['rejected_by'] = get_user_name(line.rejectedBy)
				rejections[key]['rejectedNote_artist'] = line.rejectedNote_artist
				rejections[key]['rejectedNote_department'] = line.rejectedNote_department
				rejections[key]['show_dept_name'] = get_show_title(line.cat2) if line.cat1 == 0 else get_departmentTask_title(line.cat3)
	
	return jsonify({'lines' : lines_out, 'ot_sel' : ot_sel, 'data' : data, 'rejections' : rejections})


@app.route('/timesheet/<weekStart>/unsubmit', methods=['PUT'])
def unsubmit_timesheet(weekStart):
	data = request.get_json()
	
	session_data = get_session(data['session'], data['sub'])
	userKey = session_data['userKey']

	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())

	# find timeSheetKey based on  userKey and weekStart
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()

	if not timesheet:
		return jsonify({'message' : 'issue adding timesheet line item'})

	timeSheetKey = timesheet.timeSheetKey

	db.session.query(Timesheet).filter_by(timeSheetKey=timeSheetKey).update({"status": 0, 'updatedOn' : timestamp})
	db.session.commit()
	
	return jsonify({'message' : 'timesheet status updated'})

@app.route('/timesheet/<weekStart>/status', methods=['PUT'])
def submit_timesheet(weekStart):
	data = request.get_json()
	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())

	# get user session data to get user key
	session_data = get_session(data['session'], data['sub'])
	userKey = session_data['userKey']

	# get office key for the user
	userData = User.query.filter_by(userKey=userKey).first()

	# find timeSheetKey based on  userKey and weekStart
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()

	if not timesheet:
		return jsonify({'message' : 'no timesheet found'})

	timeSheetKey = timesheet.timeSheetKey

	# reset all approvals and rejections 
	times = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).all()
	for time in times:		
		db.session.query(Time).filter_by(timeKey=time.timeKey).update({"approvedBy": None, 'approvedOn' : None, 'rejectedBy' : None, 'rejectedOn' : None, 'rejectedNote_department' : None, 'rejectedNote_artist' : None})
		db.session.commit()

	db.session.query(Timesheet).filter_by(timeSheetKey=timeSheetKey).update({"status": 1, 'updatedOn' : timestamp, 'officeKey' : userData.officeKey})
	db.session.commit()
	
	return jsonify({'message' : 'timesheet status updated'})


@app.route('/timesheet', methods=['POST'])
def save_timesheet():
	data = request.get_json()

	session_data = get_session(data['session'], data['sub'])
	userKey = session_data['userKey']
	weekStart = data['weekStart']
	

	# find timeSheetKey based on  userKey and weekStart
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=weekStart).first()

	if not timesheet:
		timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
		new_timesheet = Timesheet(userKey=str(userKey), weekOf=weekStart, status=0, updatedOn=timestamp, updatedBy=userKey)
		db.session.add(new_timesheet)
		db.session.commit()
		timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=weekStart).first()

	timeSheetKey = timesheet.timeSheetKey

	# delete all lines in database for the user and the week
	lines = Time.query.filter_by(timeSheetKey=timeSheetKey).all()
	for line in lines:
		db.session.delete(line)
		db.session.commit()

	# delete all ot selections in database for the user and the week
	lines = OvertimeSelect.query.filter_by(timeSheetKey=timeSheetKey).all()
	for line in lines:
		db.session.delete(line)
		db.session.commit()


	# add overtime selection into database
	for i, day in enumerate(data["ot_sel"]):
		ot = OvertimeSelect(
			timeSheetKey=str(timeSheetKey),
		 	cat1=day[0],
		  	cat2=day[1],
		   	day=i)
		db.session.add(ot)
		db.session.commit()

	# add lines back into database 
	for line in data["lines"]:
		
		user = User.query.filter_by(userKey=userKey).first()

		# set current department  (cat_1; 0=shows, 1=studio)
		if line['cat_1'] == 1:
			line['cat_2'] = user.departmentKey

		new_line = Time(
			timeSheetKey=str(timeSheetKey),
			userKey=userKey,
			note=line['note'],
		 	cat1=line['cat_1'],
		  	cat2=line['cat_2'],
		   	cat3=line['cat_3'],
		    cat4=line["cat_4"],
		    cat5=line["cat_5"],
		    ip=request.remote_addr,
		    hours=line["hours"])

		db.session.add(new_line)
		db.session.commit()

	return jsonify({'message' : 'timesheet line added', 'data' : data, 'timeSheetKey' : timeSheetKey, 'session' : data['session']})

@app.route('/timesheet/line/approve', methods=['POST'])
def approve_line():
	data = request.get_json()

	userKey = get_user_private_key(data['userKeyPublic'])
	
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()
	if not timesheet:
		return jsonify({'message' : 'no timesheet found'})
	
	if data['cat1'] == 1:
		times = Time.query.filter_by(userKey=userKey, timeSheetKey=timesheet.timeSheetKey, cat1=data['cat1'], cat2=data['cat2'], cat3=data['cat3']).all()
	else:		
		times = Time.query.filter_by(userKey=userKey, timeSheetKey=timesheet.timeSheetKey, cat1=data['cat1'], cat2=data['cat2']).all()

	for time in times:		
		approved_by = get_user_private_key(data['approved_by'])
		db.session.query(Time).filter_by(timeKey=time.timeKey).update({"approvedBy": approved_by, 'approvedOn' : data['approved_on']})
		db.session.commit()
	
	return jsonify({'message' : 'timesheet line approved'})


@app.route('/timesheet/line/unapprove', methods=['POST'])
def unapprove_line():
	data = request.get_json()

	userKey = get_user_private_key(data['userKeyPublic'])
	
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()
	if not timesheet:
		return jsonify({'message' : 'no timesheet found'})
	
	if data['cat1'] == 1:
		times = Time.query.filter_by(userKey=userKey, timeSheetKey=timesheet.timeSheetKey, cat1=data['cat1'], cat2=data['cat2'], cat3=data['cat3']).all()
	else:
		times = Time.query.filter_by(userKey=userKey, timeSheetKey=timesheet.timeSheetKey, cat1=data['cat1'], cat2=data['cat2']).all()

	for time in times:		
		approved_by = get_user_private_key(data['approved_by'])
		db.session.query(Time).filter_by(timeKey=time.timeKey).update({"approvedBy": None, 'approvedOn' : None})
		db.session.commit()
	
	return jsonify({'message' : 'timesheet line approved'})	



@app.route('/timesheet/line/reject', methods=['POST'])
def reject_line():
	data = request.get_json()

	userKey = get_user_private_key(data['userKeyPublic'])
	
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()
	if not timesheet:
		return jsonify({'message' : 'no timesheet found'})
	else:		
		db.session.query(Timesheet).filter_by(timeSheetKey=timesheet.timeSheetKey).update({"status": 2, "updatedOn" : data['rejected_on']})
		db.session.commit()

	times = Time.query.filter_by(userKey=userKey, timeSheetKey=timesheet.timeSheetKey, cat1=data['cat1'], cat2=data['cat2'], cat3=data['cat3']).all()

	for time in times:
		rejected_by = get_user_private_key(data['rejected_by'])
		db.session.query(Time).filter_by(timeKey=time.timeKey).update({"rejectedBy": rejected_by, 'rejectedOn' : data['rejected_on'], 'rejectedNote_artist' : data['rejectedNote_artist'] , 'rejectedNote_department' : data['rejectedNote_department']})
		db.session.commit()
	
	return jsonify({'message' : 'timesheet line rejected'})


### Drop Downs ###
@app.route('/task', methods=['GET'])
def get_tasks():
	output = {'department_tasks':[],'show_tasks':[], 'shot_tasks' : [], 'asset_tasks' : [], 'production_tasks' : [],'supervision_tasks' : []}

	for x in [[DepartmentTask,'department_tasks'],[ShowTask,'show_tasks'],[ShotTask,'shot_tasks'],[AssetTask,'asset_tasks'],[ProductionTask,'production_tasks'],[SupervisionTask,'supervision_tasks']]:
		tasks = x[0].query.order_by(x[0].orderBy).all()
		
		for task in tasks:
			task_data = {}
			task_data['cat_key'] = task.catKey
			task_data['cat_Title'] = task.taskTitle
			task_data['archived'] = task.archived
			task_data['orderBy'] = task.orderBy		
			output[x[1]].append(task_data)

	return jsonify(output)

@app.route('/task/<taskType>/<catKey>', methods=['GET'])
def get_task(taskType, catKey):
	
	if taskType not in ['department','project', 'shot', 'asset', 'production', 'supervision']:
		return jsonify({'message' : 'task type not found'})

	task_table = {'department' : DepartmentTask, 'project' : ShowTask ,'shot' : ShotTask,'asset': AssetTask,'production' : ProductionTask, 'supervision' : SupervisionTask}
	
	task = task_table[taskType].query.filter_by(catKey=str(catKey)).first()

	if not task:
		return jsonify({'message' : 'no task found'})

	task_data = {}
	task_data['catKey'] = task.catKey
	task_data['catTitle'] = task.taskTitle
	task_data['archived'] = task.archived
	task_data['orderBy'] = task.orderBy	
	
	return jsonify({'task' : task_data})


@app.route('/show/<showKey>/shot', methods=['GET'])
def get_show_shots(showKey):	
	shots = Shot.query.filter_by(showKey=showKey).all()
	output = []

	for shot in shots:
		shots_data = {}
		shots_data['cat_key'] = shot.shotKey
		shots_data['cat_Title'] = shot.shotTitle
		output.append(shots_data)

	return jsonify(output)

@app.route('/show/<showKey>/asset', methods=['GET'])
def get_show_asset(showKey):	
	assets = Asset.query.filter_by(showKey=showKey).all()
	output = []

	for asset in assets:
		asset_data = {}
		asset_data['cat_key'] = asset.assetKey
		asset_data['cat_Title'] = asset.assetTitle
		output.append(asset_data)

	return jsonify(output)
	

@app.route('/shot', methods=['POST'])
def add_shot():
	data = request.get_json()

	# add shot back into dabase 
	new_line = Shot(showKey=data['showKey'],
	   	shotTitle=data['shotTitle'])
	db.session.add(new_line)
	db.session.commit()

	return jsonify({'message' : 'shot added', 'data' : data})


@app.route('/asset', methods=['POST'])
def add_asset():
	data = request.get_json()

	# add asset back into dabase 
	new_line = Asset(showKey=data['showKey'],
	   	assetTitle=data['assetTitle'])
	db.session.add(new_line)
	db.session.commit()

	return jsonify({'message' : 'asset added', 'data' : data})


### Show Functions ###

@app.route('/show', methods=['POST'])
def add_show():
	data = request.get_json()

	new_show = Show(showTitle=data['showTitle'], showCode=data['showCode'])

	db.session.add(new_show)
	db.session.commit()
	return jsonify({'message' : 'new show created!'})


@app.route('/show', methods=['GET'])
def get_shows():
	shows = Show.query.order_by(Show.showTitle).all()
	output = []

	for show in shows:
		show_data = {}
		show_data['cat_key'] = show.showKey
		show_data['cat_Title'] = show.showTitle
		show_data['archived'] = show.archived
		
		output.append(show_data)

	return jsonify(output)


### Department Functions ###
@app.route('/department', methods=['GET'])
def get_departments():

	departments = Department.query.all()
	output = []

	for department in departments:
		department_data = {}
		department_data['cat_key'] = department.departmentKey
		department_data['cat_Title'] = department.departmentTitle

		output.append(department_data)

	return jsonify(output)


@app.route('/users/updateBamboo', methods=['GET'])
def update_user_table():
	# this will be a cron job function that can run every 10 minutes 
	users = Bamboo().get_users()

	if users:
		for bamboo in users['employees']:
			if bamboo['workEmail']:
				user_data = {}

				user_data['email'] = bamboo['workEmail']
				user_data['firstName'] = bamboo['firstName']
				user_data['lastName'] = bamboo['lastName']


				# determine department based off of Bamboo
				department = Department.query.filter_by(departmentTitle=bamboo["department"]).first()

				if not department:
					# defaults to production if no department is found (we should discuss this default)
					user_data['departmentKey'] = 17
				else:
					user_data['departmentKey'] = department.departmentKey


				# determine office based off of Bamboo
				if bamboo['location'] in ["Canada"]:
					user_data['officeKey'] = 1
				else: 
					# otherwise defaults to USA
					user_data['officeKey'] = 0


				user_data['sub'] = None
				user_data['bambooKey'] = bamboo['id']

				add_validated_user(user_data)

### Administrator Functions ###

@app.route('/delegate', methods=['GET'])
def delegates_get():
	args = request.args.to_dict()
	data = []

	userKey_delegate = get_user_private_key(args['userKey'])

	delegates = Delegator.query.filter_by(userKey_delegate=userKey_delegate).all()
	
	for delegate in delegates:
		delegate_data = {}
		delegate_data['userKey_delegate'] = get_user_public_key(delegate.userKey_delegate)
		delegate_data['public_key'] = get_user_public_key(delegate.userKey)
		delegate_data['fullName'] = get_user_name(delegate.userKey)
		
		data.append(delegate_data)

	return jsonify(data)

@app.route('/delegate/add', methods=['POST'])
def delegate_add():
	data = request.get_json()
	args = request.args.to_dict()
	
	session_data = get_session(args['session'], args['sub'])

	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
	userKey = get_user_private_key(data['userKey'])
	userKey_delegate = get_user_private_key(data['userKey_delegate'])
	userKey_createdBy = session_data['userKey']
	
	new_delegator = Delegator(userKey_delegate=userKey_delegate,userKey=userKey,createdBy=userKey_createdBy,createdOn=timestamp)
	db.session.add(new_delegator)
	db.session.commit()

	return jsonify({'message' : 'delegate added'})

@app.route('/delegate/remove', methods=['POST'])
def delegate_remove():
	data = request.get_json()

	userKey = get_user_private_key(data['userKey'])
	userKey_delegate = get_user_private_key(data['userKey_delegate'])
	
	delegates = Delegator.query.filter_by(userKey_delegate=userKey_delegate,userKey=userKey).all()
	
	for delegate in delegates:
		db.session.delete(delegate)
		db.session.commit()

	return jsonify({'message' : 'delegate removed'})	


@app.route('/approver', methods=['GET'])
def approvers_get():
	args = request.args.to_dict()
	data = []

	approvers = Approver.query.filter_by(cat1=args['cat1'],cat2=args['cat2']).all()
	
	for approver in approvers:
		approver_data = {}
		approver_data['public_key'] = get_user_public_key(approver.userKey)
		approver_data['fullName'] = get_user_name(approver.userKey)

		data.append(approver_data)

	return jsonify(data)

@app.route('/approver/add', methods=['POST'])
def approver_add():
	data = request.get_json()
	args = request.args.to_dict()
	
	session_data = get_session(args['session'], args['sub'])

	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
	userKey = get_user_private_key(data['userKey'])
	
	new_approver = Approver(userKey=userKey,cat1=data['cat1'],cat2=data['cat2'],createdBy=session_data['userKey'],createdOn=timestamp)
	db.session.add(new_approver)
	db.session.commit()

	return jsonify({'message' : 'approver added'})

@app.route('/customweek/add', methods=['POST'])
def weekStart_add():
	data = request.get_json()
	args = request.args.to_dict()
	
	session_data = get_session(args['session'], args['sub'])
	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
	
	new_weekStart = WeekStart(weekOf=data['weekOf'],newStart=data['newStart'],createdBy=session_data['userKey'],createdOn=timestamp)
	db.session.add(new_weekStart)
	db.session.commit()

	return jsonify({'message' : 'custom week added'})


@app.route('/customweek', methods=['GET'])
def weekStart_get():
	args = request.args.to_dict()
	data = []

	weekStarts = WeekStart.query.all()
	
	for weekStart in weekStarts:
		
		weekStart_data = {}
		weekStart_data['weekOf'] = get_user_public_key(weekStart.weekOf)
		weekStart_data['weekStart'] = get_user_public_key(weekStart.weekStart)
		weekStart_data['year'] = weekStart.weekOf.year
		
		data.append(weekStart_data)

	return jsonify(data)


if __name__ == "__main__":   	
	app.run()

