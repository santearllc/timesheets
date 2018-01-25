#!/usr/bin/python

from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid

app = Flask(__name__)

POSTGRES_URL ="atomicfiction.cbzrp1azkzhh.us-west-2.rds.amazonaws.com"
POSTGRES_USER ="postgres"
POSTGRES_PW ="AT0micP0stGr3Z"
POSTGRES_DB ="tss"

DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)

class User(db.Model):
	userKey = db.Column(db.Integer, primary_key=True)
	userKeyPublic = db.Column(db.String(50), unique=True)
	email = db.Column(db.String(50))
	firstName = db.Column(db.String(50))
	lastName = db.Column(db.String(50))
	officeKey = db.Column(db.Integer)

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
	rejectedNote_artist = db.String(db.Text)
	rejectedNote_department = db.String(db.Text)

class Timesheet(db.Model):
	timeSheetKey = db.Column(db.Integer, primary_key=True)	
	userKey = db.Column(db.Integer)
	status = db.Column(db.Integer)
	updatedBy = db.Column(db.Integer)
	updatedOn = db.Column(db.DateTime)	
	weekStart = db.Column(db.Date)
	weekEnd = db.Column(db.Date)

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
	catKey = db.Column(db.Integer, primary_key=True)
	bambooKey = db.Column(db.Integer)
	departmentTitle = db.Column(db.String(50))
	departmentCode = db.Column(db.String(50))	
	orderBy = db.Column(db.Integer)

class ProjectTask(db.Model):
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


# db.create_all()
# db.session.commit()


### User Functions ###

@app.route('/api/user', methods=['GET'])
def get_all_users():
	users = User.query.all();

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
		user_data['timesheetStatus'] = user.officeKey
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
	

@app.route('/api/user/<public_key>', methods=['GET'])
def get_one_user(public_key):
	user = User.query.filter_by(userKeyPublic=public_key).first();

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
	user_data['timesheetStatus'] = user.officeKey
	user_data['otSel'] = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
	user_data['data'] = {}
	user_data['data']['totalHours'] = 0
	user_data['data']['totalHours_byDay'] = {}
	user_data['data']['totalHours_byDay']['t'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['rt'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['ot'] = [0,0,0,0,0,0,0,0]
	user_data['data']['totalHours_byDay']['dt'] = [0,0,0,0,0,0,0,0]


	return jsonify({'user' : user_data})

@app.route('/api/user', methods=['POST'])
def create_user():
	data = request.get_json()

	new_user = User(userKeyPublic=str(uuid.uuid4()), email=data['email'], firstName=data['firstName'], lastName=data['lastName'], officeKey=data["officeKey"])
	db.session.add(new_user)
	db.session.commit()
	return jsonify({'message' : 'new user created!'})


@app.route('/api/user/<public_key>', methods=['DELETE'])
def delete_user(public_key):
	user = User.query.filter_by(userKeyPublic=public_key).first();

	if not user:
		return jsonify({'message' : 'no user found'})

	db.session.delete(user)
	db.session.commit();
	
	return jsonify({'message' : 'the user has been deleted'})

def get_user_current_office(email):
	# Bamboo API Call

	# query UserOfficeHistory to see if current, if not add record and return value
	return 1


def get_user_private_key(userKeyPublic):
	user = User.query.filter_by(userKeyPublic=userKeyPublic).first();
	if not user:
		return False

	return user.userKey

### Timesheet Functions ###
@app.route('/api/timesheet/<userKeyPublic>', methods=['GET'])
def get_user_timesheet(userKeyPublic):
	userKey = get_user_private_key(userKeyPublic)
	if not userKey:
		return jsonify({'message' : 'no user found'})

	data = {}
	args = request.args.to_dict()
	data['weekStart'] = args['weekStart']

	# select timesheet
	timesheet = Timesheet.query.filter_by(weekStart=args['weekStart']).first();
	
	if not timesheet:		
		new_timesheet = Timesheet(userKey=str(userKey), weekStart=args['weekStart'])
		db.session.add(new_timesheet)
		db.session.commit()		
		
		data['timesheetStatus'] = '1'
		time = []
	else: 
		data['timesheetStatus'] = '1'

		# select lines 
		time = Time.query.filter_by(timeSheetKey=timesheet.timeSheetKey).first();
	
	return jsonify({'lines' : time, 'data' : data, 'userKeyPublic' : userKeyPublic})


@app.route('/api/timesheet/line', methods=['POST'])
def add_line_timesheet():
	# update timesheet with latest lines
	args = request.args.to_dict()


	return jsonify({'message' : 'timesheet line added'})


def update_timesheet(weekStart, userKeyPublic):
	# update timesheet with latest lines
	args = request.args.to_dict()
	pass

def submit_timesheet(weekStart, userKeyPublic):
	# change timesheet status to 2 and update timestamp and submitted by fields. 
	args = request.args.to_dict()
	pass

def approve_line():
	# approve time sheet line	
	args = request.args.to_dict()
	pass

def reject_line():
	# reject time sheet line	
	args = request.args.to_dict()
	pass


### Drop Downs ###

@app.route('/api/task', methods=['GET'])
def get_tasks():
	output = {'ProjectTask':[], 'ShotTask' : [], 'AssetTask' : [], 'ProductionTask' : [],'SupervisionTask' : []}

	for x in [[DepartmentTask,'DepartmentTask'],[ProjectTask,'ProjectTask'],[ShotTask,'ShotTask'],[AssetTask,'AssetTask'],[ProductionTask,'ProductionTask'],[SupervisionTask,'SupervisionTask']]:
		tasks = x[0].query.order_by(x[0].orderBy).all();
		
		for task in tasks:
			task_data = {}
			task_data['catKey'] = task.catKey
			task_data['catTitle'] = task.taskTitle
			task_data['archived'] = task.archived
			task_data['orderBy'] = task.orderBy		
			output[x[1]].append(task_data)

	return jsonify(output)

@app.route('/api/task/<taskType>/<catKey>', methods=['GET'])
def get_task(taskType, catKey):
	
	if taskType not in ['department','project', 'shot', 'asset', 'production', 'supervision']:
		return jsonify({'message' : 'task type not found'})

	task_table = {'department' : DepartmentTask, 'project' : ProjectTask ,'shot' : ShotTask,'asset': AssetTask,'production' : ProductionTask, 'supervision' : SupervisionTask}
	
	task = task_table[taskType].query.filter_by(catKey=str(catKey)).first();

	if not task:
		return jsonify({'message' : 'no task found'})

	task_data = {}
	task_data['catKey'] = task.catKey
	task_data['catTitle'] = task.taskTitle
	task_data['archived'] = task.archived
	task_data['orderBy'] = task.orderBy		
	
	return jsonify({'task' : task_data})


@app.route('/api/deparment', methods=['GET'])
def get_department():	
	departments = Department.query.order_by(Department.orderBy).all();
	output = []	

	for department in departments:
		department_data = {}	
		department_data['catKey'] = department.catKey
		department_data['departmentTitle'] = department.departmentTitle
		department_data['departmentCode'] = department.departmentCode
		department_data['orderBy'] = department.orderBy
		output.append(department_data)

	return jsonify({'tasks' : output})


### Show Functions ###

@app.route('/api/show', methods=['POST'])
def add_show():
	data = request.get_json()

	new_show = Show(showTitle=data['showTitle'], showCode=data['showCode'])

	db.session.add(new_show)
	db.session.commit()
	return jsonify({'message' : 'new show created!'})


@app.route('/api/show', methods=['GET'])
def get_shows():

	shows = Show.query.order_by(Show.showTitle).all();
	output = []

	for show in shows:
		show_data = {}
		show_data['catKey'] = show.showKey
		show_data['catTitle'] = show.showTitle
		show_data['catCode'] = show.showCode

		output.append(show_data)

	return jsonify(output)



if __name__ == "__main__": 
  #app.run(host='0.0.0.0', port=5000, debug=True)
  app.run()