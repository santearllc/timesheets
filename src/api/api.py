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
POSTGRES_URL ="atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
POSTGRES_USER ="postgres"
POSTGRES_PW ="AT0micP0stGr3Z"
POSTGRES_DB ="tss"

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

class Timesheet(db.Model):
	timeSheetKey = db.Column(db.Integer, primary_key=True)	
	userKey = db.Column(db.Integer)
	status = db.Column(db.Integer)
	updatedBy = db.Column(db.Integer)
	updatedOn = db.Column(db.DateTime)	
	weekOf = db.Column(db.Date)	

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

class Department(db.Model):
	departmentKey = db.Column(db.Integer, primary_key=True)
	bambooKey = db.Column(db.Integer)
	departmentTitle = db.Column(db.String(50))
	departmentCode = db.Column(db.String(50))
	orderBy = db.Column(db.Integer)

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
	showKey = db.Column(db.Integer)
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


# Uncomment two lines below if adding new model (Table) to db.  Note: If you modify a model 
# above it will not get updated when running create_all(). You must update column in dbms or via sql. 
# db.create_all()
# db.session.commit()

### User Functions ###

# is current email address in db? if not, then get a current list of bamboo users; else just log person in. 
# 1 if the person logging in is 
# 2 





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
	    # bamboo = Bamboo().get_user_byEmail(idinfo['email'])
	    bamboo = Bamboo().get_user_byEmail('carsten@atomicfiction.com')
	    if not bamboo:
			return jsonify({'valid' : False, 'id_token' : token, 'message' : 'Email address ('+idinfo['email']+') is not registered in BambooHR. Contact your supervisor to correct.'})


	    # ID token is valid. Get the user's Google Account ID from the decoded token.
	    sub = idinfo['sub']
	    user_data = {}
	    user_data['email'] = idinfo['email']
	    user_data['firstName'] = idinfo['given_name']
	    user_data['lastName'] = idinfo['family_name']
	    user_data['officeKey'] = 1
	    user_data['sub'] = idinfo['sub']
	    user_data['bambooKey'] = bamboo['id']
	    userKey = add_validated_user(user_data)

	    session = str(uuid.uuid4())
	    add_session(userKey, session, token, sub)

	    return jsonify({'valid' : True, 'session' : session,  'id_token' : token, 'sub' : sub, 'email' : idinfo['email'], 'firstName' : idinfo['given_name'], 'lastName' : idinfo['family_name'], 'userKey' : userKey, 'data': data})
	except ValueError:
	    # Invalid token 
	    return jsonify({'valid' : False, 'id_token' : token})


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
	user = User.query.filter_by(sub=data["sub"]).first()

	# only add a user if they arent in the tss database
	if not user:
		userKeyPublic = str(uuid.uuid4())
		new_user = User(userKeyPublic=userKeyPublic, email=data['email'], firstName=data['firstName'], lastName=data['lastName'], officeKey=data["officeKey"], sub=data["sub"], bambooKey=data['bambooKey'])		
		db.session.add(new_user)
		db.session.commit()
		return get_user_private_key(userKeyPublic)
	else:
		return user.userKey


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
		user_data['timesheetStatus'] = 1
		user_data['otSel'] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
		user_data['data'] = {}
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

def get_user_current_office(email):
	# Bamboo API Call

	# query UserOfficeHistory to see if current, if not add record and return value
	return 1


def get_user_private_key(userKeyPublic):
	user = User.query.filter_by(userKeyPublic=userKeyPublic).first()
	if not user:
		return False

	return user.userKey

### Timesheet Functions ###
@app.route('/timesheet', methods=['GET'])
def get_user_timesheet():
	args = request.args.to_dict()

	data = {}	

	data['weekStart'] = args['weekStart']
	ot_sel = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]

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

		data['status'] = 1
		data['existing'] = False		
		data['updatedOn'] = False

		if not timesheet:			
			lines_out = []
		else:			
			data['existing'] = False
			data['auto_generated_time_sheet'] = True
			data['status'] = timesheet.status
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
	
	return jsonify({'lines' : lines_out, 'ot_sel' : ot_sel, 'data' : data})


@app.route('/timesheet/<weekStart>/unsubmit', methods=['PUT'])
def unsubmit_timesheet_status(weekStart):
	data = request.get_json()
	
	session_data = get_session(data['session'], data['sub'])
	userKey = session_data['userKey']

	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())

	# find timeSheetKey based on  userKey and weekStart
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()

	if not timesheet:
		return jsonify({'message' : 'issue adding timesheet line item'})

	timeSheetKey = timesheet.timeSheetKey

	db.session.query(Timesheet).filter_by(timeSheetKey=timeSheetKey).update({"status": 1, 'updatedOn' : timestamp})
	db.session.commit()
	
	return jsonify({'message' : 'timesheet status updated'})

@app.route('/timesheet/<weekStart>/status', methods=['PUT'])
def update_timesheet_status(weekStart):
	data = request.get_json()
	
	session_data = get_session(data['session'], data['sub'])
	userKey = session_data['userKey']

	timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())


	# find timeSheetKey based on  userKey and weekStart
	timesheet = Timesheet.query.filter_by(userKey=userKey, weekOf=data['week_of']).first()

	if not timesheet:
		return jsonify({'message' : 'issue adding timesheet line item'})

	timeSheetKey = timesheet.timeSheetKey

	db.session.query(Timesheet).filter_by(timeSheetKey=timeSheetKey).update({"status": 2, 'updatedOn' : timestamp})
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
		new_timesheet = Timesheet(userKey=str(userKey), weekOf=weekStart, status=1, updatedOn=timestamp, updatedBy=userKey)
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
		new_line = Time(
			timeSheetKey=str(timeSheetKey),
			userKey=str(1),
			note=line['note'],
		 	cat1=line['cat_1'],
		  	cat2=line['cat_2'],
		   	cat3=line['cat_3'],
		    cat4=line["cat_4"],
		    cat5=line["cat_5"],
		    hours=line["hours"])
		db.session.add(new_line)
		db.session.commit()

	return jsonify({'message' : 'timesheet line added', 'data' : data, 'timeSheetKey' : timeSheetKey, 'session' : data['session']})

def approve_line():
	# approve time sheet line	
	args = request.args.to_dict()
	pass

def reject_line():
	# reject time sheet line	
	args = request.args.to_dict()
	pass


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
		
		output.append(show_data)

	return jsonify(output)


### Department Functions ###
@app.route('/department', methods=['GET'])
def get_departments():

	departments = Department.query.order_by(Department.departmentTitle).all()
	output = []

	for department in departments:
		department_data = {}
		department_data['cat_key'] = department.departmentKey
		department_data['cat_Title'] = department.departmentTitle

		output.append(department_data)

	return jsonify(output)



if __name__ == "__main__":   	
	app.run()

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'