// 
// AUTHOR: Tyler Cote
// EMAIL: tyler@santear.com
// 
// nOTE: Using the following index for days of week; 0 = Monday; 
// functions : camelCase
// variables: lowercase, separate_words_with_underscore 

import { Component, OnInit, NgZone } from '@angular/core';
import { ServiceService } from '../services/service.service';


declare const gapi: any;  
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})


export class EntryComponent {
	// store all variables, objects, arrays in this object
	vars = Object();

	// temporary variables used during development	
	user_department = 8;

	constructor(public serviceService: ServiceService) {		
	}

	ngOnInit() {
		// set initial variables
		this.vars.lines = [];
		this.vars.loaded = [];
		this.vars.loaded_shows = [];
		this.vars.undo = [];
		this.vars.redo = [];
		this.vars.days = [0, 1, 2, 3, 4, 5, 6];
		this.vars.ot_req = [0, 0, 0, 0, 0, 0, 0];
		this.vars.ot_sel;
		this.vars.current_office = 1;  // 0 = Oakland   1 = Montreal		
		this.vars.user_name = "Logging In...";
		this.vars.timesheet_submitted = false;
		this.vars.valid_login = true;
		this.vars.showEntryComponent = true;
		this.vars.department = 0; // default to production
		this.vars.delegate = []		
		this.vars.rate_type = 'hourly'
		// this.serviceService.delegator_selected = -1;
		
		
		this.vars.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};


		// set title object initial state
		this.vars.titles_obj = {
			0: { title: 'Shows', cat_2: {}, cat_3: {}, cat_4: {} },
			1: { title: 'Studio', cat_2: {}, cat_3: {}, cat_4: {} }
		}

		// set shots and assets by show objects
		this.vars.shots_byShow = {};
		this.vars.assets_byShow = {};

		// create calendar for current week		
		this.vars.calendar = this.serviceService.generateCalendar(new Date());
		this.vars.week_label = this.serviceService.calendarLabel(this.vars.calendar.week_of);

		this.vars.week_of = this.vars.calendar.week_of;
		this.serviceService.valid_login = false
		this.serviceService.show_signin = false

		this.serviceService.validateLogin().subscribe(res => {			
			this.serviceService.googleInit();

			if (!res['valid']) {				
				this.serviceService.show_signin = true
				this.vars.valid_login = false;
				this.vars.invalid_login_res = res['message'];
				
				setTimeout(timeout => {
					this.serviceService.logOut()
				}, 2000)
			} else if (!this.serviceService.getCookie('logged_in')) {
				setTimeout(timeout => {
					this.serviceService.logOut()
				}, 500)
			} else {
				this.serviceService.access = res['access'];
				
				document.cookie = "session=" + res.session;
				document.cookie = "sub=" + res.sub;
				this.serviceService.valid_login = true;
				this.vars.department = parseInt(res['department']);

				// load timesheet and associated shows, departments, and tasks for current week
				//this.loadWeek();
				var week_of = this.serviceService.determineWeek(new Date(), 0);

				if(this.serviceService.week_of != null){
					week_of = this.serviceService.week_of;
				}
				
				var week_of_label = this.serviceService.calendarLabel(week_of)
				
				this.weekSelected(week_of_label, week_of)
				
				this.serviceService.checkLogin()				
			}
		});
	}

	load_delegated(user_key, user_name){
		this.vars.user_name = user_name
		this.vars.show_delegated = false;
		this.serviceService.delegator_selected = user_key
		
		this.vars.showTimeSheet = false

		this.loadWeek()
	}

	loadWeek() {
		// reset loaded
		this.vars.loaded = [];

		// get tasks, shows, departments
		this.getShowsDepartmentsTasks();

		// get current time sheet
		setTimeout(res=> {
			this.getTimeSheet();
		},1000)		
	}

	getShowsDepartmentsTasks() {
		// load department list - put into title object
		this.serviceService.getDepartments_db().subscribe(res => {
			// set vars.departments to res 
			this.vars.departments = res;

			for (var i = 0; i < res.length; i++) {
				if (!this.vars.titles_obj[1]['cat_2'].hasOwnProperty(res[i].cat_key)) {
					this.vars.titles_obj[1]['cat_2'][res[i].cat_key] = { title: '', children: {} };
				}
				this.vars.titles_obj[1]['cat_2'][res[i].cat_key]['title'] = res[i].cat_Title;
			}

			// once all of the departments have been loaded check to see if the timesheet can be displayed
			this.checkLoaded('departments');
		});

		// load show list - put into title object
		this.serviceService.getShows_db().subscribe(res => {
			// set vars.shows to res
			this.vars.shows = res;

			for (var i = 0; i < res.length; i++) {
				if (!this.vars.titles_obj[0]['cat_2'].hasOwnProperty(res[i].cat_key)) {
					this.vars.titles_obj[0]['cat_2'][res[i].cat_key] = { title: '', children: {} };
				}
				this.vars.titles_obj[0]['cat_2'][res[i].cat_key]['title'] = res[i].cat_Title;
			}

			// once all of the shows have been loaded check to see if the timesheet can be displayed
			this.checkLoaded('shows');
		});

		// load tasks - put into title object
		this.serviceService.getTasks_db().subscribe(res => {
			// set vars.tasks to res 
			this.vars.tasks = res;

			//  setup show tasks - put into title object
			for (var i = 0; i < res['show_tasks'].length; i++) {
				if (!this.vars.titles_obj[0]['cat_3'].hasOwnProperty(res['show_tasks'][i].cat_key)) {
					this.vars.titles_obj[0]['cat_3'][res['show_tasks'][i].cat_key] = { title: '', cat_4: {} };
				}
				this.vars.titles_obj[0]['cat_3'][res['show_tasks'][i].cat_key]['title'] = res['show_tasks'][i].cat_Title;
			}

			// department tasks - put into title object
			for (var i = 0; i < res['department_tasks'].length; i++) {
				if (!this.vars.titles_obj[1]['cat_3'].hasOwnProperty(res['department_tasks'][i].cat_key)) {
					this.vars.titles_obj[1]['cat_3'][res['department_tasks'][i].cat_key] = { title: '', children: {} }
				}
				this.vars.titles_obj[1]['cat_3'][res['department_tasks'][i].cat_key]['title'] = res['department_tasks'][i].cat_Title
			}

			// setup asset, shot, production, and supervision tasks - put into title object
			var tasks = [['asset_tasks', 4], ['shot_tasks', 5], ['production_tasks', 6], ['supervision_tasks', 7]];
			for (var t = 0; t < tasks.length; t++) {
				//  asset tasks
				for (var i = 0; i < res[tasks[t][0]].length; i++) {
					if (!this.vars.titles_obj[0]['cat_3'][tasks[t][1]]['cat_4'].hasOwnProperty(res[tasks[t][0]][i].cat_key)) {
						this.vars.titles_obj[0]['cat_3'][tasks[t][1]]['cat_4'][res[tasks[t][0]][i].cat_key] = { title: '' };
					}
					this.vars.titles_obj[0]['cat_3'][tasks[t][1]]['cat_4'][res[tasks[t][0]][i].cat_key]['title'] = res[tasks[t][0]][i].cat_Title;
				}
			}

			// once all of the tasks have been loaded check to see if the timesheet can be displayed
			this.checkLoaded('tasks');
			console.log('Titles: ')
			console.log(this.vars.titles_obj)
		});
	}

	getTimeSheet() {
		// load current weekOf time sheet from database
		var data_in = {}
		data_in['week_of'] = this.vars.week_of;		
		data_in['user_key'] = this.serviceService.delegator_selected;

		this.serviceService.getTimeSheet_db(data_in).subscribe(res => {

			// set label for user name (default to email address if f and l name is not set)
			if (res['user_data']['firstName'].length == 0 && res['user_data']['lastName'].length == 0) {
				this.vars.user_name = res['user_data']['email'];
			} else {
				this.vars.user_name = res['user_data']['firstName'] + ' ' + res['user_data']['lastName'];
			}

			// set rate type (default to hourly if none set)
			if(res['user_data']['rateType'] == 'salary' || res['user_data']['rateType'] == 'hourly'){
				this.vars.rate_type = res['user_data']['rateType']
			} else {
				this.vars.rate_type = 'hourly'
			}
			

			this.vars.rejections = res['rejections']
			this.vars.status = res.data.status;
			this.vars.payroll_status = res.payroll_status;
			this.vars.payroll_week_of = res.payroll_week_of;
			this.vars.delegate = res.delegating;

			this.get_payroll_status();

			this.vars.auto_generated_time_sheet = res.data.auto_generated_time_sheet;

			if (res.data.auto_generated_time_sheet) {
				clearTimeout(this.vars.auto_generated_time_sheet_timeout);

				this.vars.auto_generated_time_sheet_timeout = setTimeout(run => {
					this.vars.auto_generated_time_sheet = false;
				}, 5000)
			}

			// If the timesheet is blank then the initial template needs to be applied; else use lines from database
			if (res.lines.length <= 0) {
				this.vars.lines = Array();
				this.vars.lines = this.deepClone(this.serviceService.getInitLines())
			} else {
				this.vars.lines = res.lines
			}

			// if the time status is 1 or >= 3 (submitted or (partial)approved) then change the var to true
			if (res.data.status == 1 || res.payroll_status > 0) {
				
				this.vars.timesheet_submitted = true;
				var client_timestamp = this.serviceService.date_server_to_client(res.data.updatedOn)
				this.vars.submit_date = this.serviceService.generateDate(client_timestamp)

			} else {
				this.vars.timesheet_submitted = false;
				var existing = {0 : false, 1 : false}

				for(var i = 0; i < this.vars.lines.length; i++){
					existing[this.vars.lines[i]['cat_1']]   = true;
				}
				
				if(!existing[0]){
					var init_lines = this.deepClone(this.serviceService.getInitLines());
					this.vars.lines.push(init_lines[0]);				
				}
				if(!existing[1]){
					init_lines[1].cat_2 = this.vars.department;
					this.vars.lines.push(init_lines[1]);
				}
			}

			

			// set overtime selection from database
			this.vars.ot_sel = res.ot_sel

			// reset loaded shows array
			this.vars.loaded_shows = [];

			// determine which shows exist on timesheet and then load their shots and assets
			for (var i = 0; i < this.vars.lines.length; i++) {
				var line = this.vars.lines[i]
				if (line['cat_1'] == 0 && line['cat_2'] != null) {
					if (this.vars.loaded_shows.indexOf(line['cat_2']) == -1) {
						this.vars.loaded_shows.push(line['cat_2']);
						this.loadShotAssetsForShow(line['cat_2']);
					}
				}
			}

			// once all of the shows' shots and assets have been loaded check to see if the timesheet can be displayed
			this.checkLoaded('timesheet');
		});
	}

	get_payroll_status(){
		clearTimeout(this.vars.get_payroll_status_timeout)

		this.serviceService.get_pay_period_lock(this.vars.payroll_week_of).subscribe(res => {
			this.vars.payroll_status = res.status;
			if (this.vars.payroll_status > 0 || this.vars.status == 1) {
				this.vars.timesheet_submitted = true;
			} else {
				this.vars.timesheet_submitted = false;
			}

			this.vars.get_payroll_status_timeout = setTimeout(res=>{
				this.get_payroll_status()
			}, 5000)
		});		
	}

	displayTimeSheet() {
		// convert lines from database to an object
		var converted = this.convertLinesToObject(this.vars.lines);

		this.vars.timesheet = this.serviceService.generateTimesheetByUser(converted['timesheet']);

		// sum hours
		this.vars.timesheet = this.serviceService.sumHours(this.vars.timesheet);
		this.vars.showTimeSheet = true;

		// update the timesheet totals
		this.updateTimesheetTotals();
	}

	checkLoaded(resource) {
		// add loaded resource to loaded array
		this.vars.loaded.push(resource);

		// If all resources have been loaded then show entry page 
		// 4 = the shows, tasks, departments, and timesheet queries to the db
		// the second part to the equation is the shows associated to the timesheet *2 (shots and assets) queries to the db
		if (this.vars.loaded.length == (4 + (this.vars.loaded_shows.length * 2))) {
			this.displayTimeSheet();
		}
	}


	loadShotAssetsForShow(showKey) {
		// get shots for selected project and add to vars.assets_byShow
		this.serviceService.getAssets_db(showKey).subscribe(res => {

			// set up object to have both an array of tasks and object for tasks
			this.vars.assets_byShow[showKey] = { 'arr': [], 'obj': {} };
			this.vars.assets_byShow[showKey]['arr'] = res;

			// add items to array
			for (var i = 0; i < res.length; i++) {
				this.vars.assets_byShow[showKey]['obj'][res[i]['cat_key']] = res[i];
			}
			this.checkLoaded(showKey);
		})

		// get assets for selected project and add to this.vars.
		this.serviceService.getShots_db(showKey).subscribe(res => {

			// set up object to have both an array of tasks and object for tasks
			this.vars.shots_byShow[showKey] = { 'arr': [], 'obj': {} };
			this.vars.shots_byShow[showKey]['arr'] = res;

			// add items to array
			for (var i = 0; i < res.length; i++) {
				this.vars.shots_byShow[showKey]['obj'][res[i]['cat_key']] = res[i];
			}
			this.checkLoaded(showKey);
		})
	}

	weekSelected(week_of_label, week_of) {
		// set week of value
		this.vars.week_of = week_of;
		this.vars.week_label = this.serviceService.calendarLabel(this.vars.week_of);

		// determine back and forth week
		var date_in = new Date(week_of + ' 00:00:00:00');
		var week_back = new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate() - 7);
		var week_forth = new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate() + 7);

		// create labels for back forth buttons for calendar
		this.vars.calendar.week_back.week_of = this.serviceService.date_yyyymmdd_dashed(week_back);
		this.vars.calendar.week_back.label = this.serviceService.calendarLabel(this.vars.calendar.week_back.week_of);
		this.vars.calendar.week_forth.week_of = this.serviceService.date_yyyymmdd_dashed(week_forth);
		this.vars.calendar.week_forth.label = this.serviceService.calendarLabel(this.vars.calendar.week_forth.week_of);
		this.vars.calendar.week_label = week_of_label;

		// hide calendar and time sheet
		this.vars.showCal = false;
		this.vars.showTimeSheet = false;

		// get shows, departments, tasks, and timesheet for specific week
		this.loadWeek()
	}

	convertLinesToObject(lines) {
		// function converts lines from database to an object, which essentially merges all
		// of the lines into a structure that can be used to setup the timesheet.
		let timesheet = {};

		// Go through all of the lines and create object strcuture 
		for (var i = 0; i < lines.length; i++) {
			var element = this.vars.lines[i];

			try {
				if (!timesheet.hasOwnProperty(element['cat_1']) && element['cat_1'] != null) {
					timesheet[element['cat_1']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['cat_1']].hasOwnProperty(element['cat_2']) && element['cat_2'] != null) {
					timesheet[element['cat_1']][element['cat_2']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['cat_1']][element['cat_2']].hasOwnProperty(element['cat_3']) && element['cat_3'] != null) {
					timesheet[element['cat_1']][element['cat_2']][element['cat_3']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['cat_1']][element['cat_2']][element['cat_3']].hasOwnProperty(element['cat_4']) && element['cat_4'] != null) {
					timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']].hasOwnProperty(element['cat_5']) && element['cat_5'] != null) {
					timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']] = {};
				}
			} catch (err) { }


			// assign element hours and notes to time sheet object
			if (element['cat_5'] != null) {
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']]['hours'] = element['hours'];
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']]['note'] = element['note'];
			} else if (element['cat_4'] != null) {
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']]['hours'] = element['hours'];
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']]['note'] = element['note'];
			} else if (element['cat_3'] != null) {
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']]['hours'] = element['hours'];
				timesheet[element['cat_1']][element['cat_2']][element['cat_3']]['note'] = element['note'];
			} else if (element['cat_2'] != null) {
				timesheet[element['cat_1']][element['cat_2']]['hours'] = element['hours'];
				timesheet[element['cat_1']][element['cat_2']]['note'] = element['note'];
			} else if (element['cat_1'] != null) {
				timesheet[element['cat_1']]['hours'] = element['hours'];
				timesheet[element['cat_1']]['note'] = element['note'];
			}
		}
		return { timesheet: timesheet }
	}

	saveTimesheet() {
		// set save_status and color to saving/yellow
		this.vars.save_status = "saving";
		this.vars.save_status_color = "yellow";

		clearTimeout(this.vars.save_timeout);

		// return state back to saved after a certain period. 
		this.vars.save_timeout = setTimeout(run => {
			var data_in = Object();
			data_in.lines = this.vars.lines;
			data_in.ot_sel = this.vars.ot_sel;
			data_in.userKey = this.serviceService.delegator_selected

			// save lines and ot selection to database
			this.serviceService.saveTimeSheet(data_in, this.vars.week_of).subscribe(res => {				
				// set save_status and color to saved/green
				this.vars.save_status = "saved";
				this.vars.save_status_color = "green";
			});
		}, 1500);
	}

	// updates hours in time sheet obj and lines
	updateHours(event, hours, day) {		
		this.resetMenus(false, false)
		var charCode = (event.which) ? event.which : event.keyCode;

		// hide remove buttons and menu
		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);
		this.vars.show_edit_line_items = false;
		this.vars.edit_line_items = false;

		// if the current value entered is note a number or length of 0 (after trimming) then set current value to 0.0. 
		if (isNaN(event.target.value) || event.target.value.trim() == '') {
			hours[day] = 0;
			if (event.target.value.trim() != '.') {
				event.target.value = '';
			}
		} else {
			hours[day] = parseFloat(event.target.value);

			if (event.type == 'blur' && event.target.value == 0) {
				event.target.value = '';
			}
			this.saveTimesheet();
			this.addToUndo(this.vars.lines);
		}

		// update timesheet totals and validate overtime
		this.updateTimesheetTotals();

		// delete or backspace pressed
		if (charCode == 8 || charCode == 46) {
			this.saveTimesheet();
			this.addToUndo(this.vars.lines);
		}
	}


	updateTimesheetTotals() {
		// Reset timehseet totals before running function
		this.vars.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};

		// Loop through cat_1 parents
		this.vars.timesheet.forEach(cat_1 => {
			if (cat_1.hours != undefined) {
				this.addToTotals(cat_1.hours, false);
			}

			// Loop through cat_1 children
			cat_1.children.forEach(cat_2 => {
				cat_2.sum_hours = [0, 0, 0, 0, 0, 0, 0]
				if (cat_2.hours != undefined) {
					this.addToTotals(cat_2, cat_2);
				}

				// Loop through cat_2 children
				cat_2.children.forEach(cat_3 => {
					if (cat_3.hours != undefined) {
						this.addToTotals(cat_3, cat_2);
					}

					// Loop through cat_3 children
					cat_3.children.forEach(cat_4 => {
						if (cat_4.hours != undefined) {
							this.addToTotals(cat_4, cat_2);
						}

						cat_4.children.forEach(cat_5 => {
							if (cat_5.hours != undefined) {
								this.addToTotals(cat_5, cat_2);
							}
						});
					});
				});
			});
		});

		// sum of all days of the week
		this.vars.timesheet_totals['rt'][7] = this.vars.timesheet_totals['rt'][0]
			+ this.vars.timesheet_totals['rt'][1]
			+ this.vars.timesheet_totals['rt'][2]
			+ this.vars.timesheet_totals['rt'][3]
			+ this.vars.timesheet_totals['rt'][4]
			+ this.vars.timesheet_totals['rt'][5]
			+ this.vars.timesheet_totals['rt'][6];

		// detertime break down of overtime hours
		if(this.vars.rate_type != 'salary'){
			var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(this.vars.timesheet, this.vars.timesheet_totals, this.vars.current_office);
			this.vars.timesheet_totals = totalsOvertimeBreakdown['TotalHours_byDay'];
			this.vars.timesheet_totals_byShow = totalsOvertimeBreakdown['TotalHours_byShow'];
		}
		

		// validate overtime and determine overtime breakdown
		this.validateOvertime();
		this.serviceService.overtimeBreakdown(this.vars, false);
	}

	addToTotals(array_in, sum_hours) {
		if (sum_hours != false) {
			for (var i = 0; i < 7; i++) {
				this.vars.timesheet_totals['rt'][i] += array_in.hours[i];
				sum_hours.sum_hours[i] += array_in.hours[i];
			}
		}
	}

	// used in entry.component.html to determine if the OT row should be displayed (specifically for the department section of the time sheet)
	showOvertimeIcons(ot_req, hours) {
		for (var i = 0; i < 7; i++) {
			if (hours[i] > 0.0 && ot_req[i]) {
				return true;
			}
		}
		return false;
	}


	setOvertimeChoice(cat_1, cat_2, day) {
		this.resetMenus(false, false)
		if (this.vars.current_office == 0) { // Oakland office rules			
			if (this.vars.ot_sel[day][0] == cat_1 && this.vars.ot_sel[day][1] == cat_2) {
				// toggles OT off
				this.vars.ot_sel[day][0] = -1;
				this.vars.ot_sel[day][1] = -1;
			} else {
				this.vars.ot_sel[day][0] = cat_1;
				this.vars.ot_sel[day][1] = cat_2;
			}

		} else if (this.vars.current_office == 1) { //Montreal office rules
			// toggles OT off for every day
			for (var i = 0; i < 7; i++) {
				if (i != day) {
					this.vars.ot_sel[i][0] = -1;
					this.vars.ot_sel[i][1] = -1;
				}
			}

			if (this.vars.ot_sel[day][0] == cat_1 && this.vars.ot_sel[day][1] == cat_2) {
				// toggles OT off
				this.vars.ot_sel[day][0] = -1;
				this.vars.ot_sel[day][1] = -1;
			} else {
				this.vars.ot_sel[day][0] = cat_1;
				this.vars.ot_sel[day][1] = cat_2;
			}
		}

		// calculates over time breakdown array
		this.serviceService.overtimeBreakdown(this.vars, false)

		this.saveTimesheet();
	}

	showSelected(el, cat) {
		if (el.cat_key > 0) {
			cat.shot_selected = el;
			this.addLineItem([cat]);
		}
	}

	addRowOptionChanged(cats, option_sel = Object()) {		
		var cat = cats[cats.length - 1];
		cat.results = [];

		if (parseInt(cats[0].cat_key) == 1) { // Departments
			
			if (cat.cat_key >= 0 && option_sel.cat_key >= 0) {
				cat.departmentTask = option_sel.cat_key;
				this.addLineItem(cats);
			}
		} else { // Shows			
			if (cat.showTask == -1) {
				return false;
			} else if (cat.showTask == 4) {
				
				if (cat.assetTask != -1 && cat.shot_selected && cat.shot_selected.cat_key >= 0) {
					this.addLineItem(cats);
				} else {
					if (cat.assetTask != undefined && cat.assetTask > -1) {
						this.inputFocus(cats, 'shot');
					} else {
						this.inputFocus(cats, 'assetTask');
					}
				}
			} else if (cat.showTask == 5) {
				if (cat.shotTask != -1 && cat.shot_selected && cat.shot_selected.cat_key >= 0) {
					this.addLineItem(cats);
				} else {
					if (cat.shotTask != undefined && cat.shotTask > -1) {
						this.inputFocus(cats, 'shot');
					} else {
						this.inputFocus(cats, 'shotTask');
					}
				}
			} else if (cat.showTask == 6) {
				this.inputFocus(cats, 'productionTask');
				if (cat.productionTask != -1 && cat.productionTask != undefined) {
					this.addLineItem(cats);
				}
			} else if (cat.showTask == 7) {
				this.inputFocus(cats, 'supervisionTask');
				if (cat.supervisionTask != -1 && cat.supervisionTask != undefined) {
					this.addLineItem(cats);
				}
			} else {
				this.addLineItem(cats);
			}
		}
	}


	addLineItem(cats) {		
		var cat = cats[cats.length - 1];
		var cat_array = [];
		var hours = [0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < 5; i++) {
			try {
				cat_array.push({
					cat_key: parseInt(cats[i].cat_key)
				});
			} catch (err) {
				cat_array.push({
					cat_key: null
				})
			}
		}

		if (cats.length == 1) {
			if (cats[0]['cat_key'] == 0) {  // Shows
				hours = null;
				cat_array[1] = {
					cat_key: cat.shot_selected.cat_key
				};
				this.loadShotAssetsForShow(cat.shot_selected.cat_key);
				this.inputFocus(cat_array, 'showTask');
			} else {  // Departments				
				cat_array[1] = {
					cat_key: cat.department
				};
				cat_array[2] = {
					cat_key: cat.departmentTask
				};
			}
		} else if (cats.length == 2 && cats[0]['cat_key'] == 1) {
			cat_array[2] = {
				cat_key: cat.departmentTask
			};
		} else if (cats.length == 4) {
			if (cat_array[2]['cat_key'] == 5) {
				cat_array[4] = {
					cat_key: cat.shot_selected.cat_key
				};
			} else {
				cat_array[4] = {
					cat_key: cat.shot_selected.cat_key
				};
			}
		} else if (cats.length == 3) {
			if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = {
					cat_key: cat.productionTask
				};
			} else if (cat_array[2]['cat_key'] == 7) {
				cat_array[3] = {
					cat_key: cat.supervisionTask
				};
			}
		} else {
			cat_array[2] = {
				cat_key: cat.showTask
			};
			if (cat_array[2]['cat_key'] == 5 || cat_array[2]['cat_key'] == 4) {
				cat_array[4] = {
					cat_key: cat.shot_selected.cat_key
				};
				if (cat_array[2]['cat_key'] == 5) {
					cat_array[3] = {
						cat_key: cat.shotTask
					};
				} else {
					cat_array[3] = {
						cat_key: cat.assetTask
					};
				}
			} else if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = {
					cat_key: cat.productionTask
				};
			} else if (cat_array[2]['cat_key'] == 7) {
				cat_array[3] = {
					cat_key: cat.supervisionTask
				};
			}
		}


		var tmp_cats = Array();

		for (var i = 0; i < cat_array.length; i++) {
			if (cat_array[i]['cat_key'] != null) {
				tmp_cats.push(cat_array[i]['cat_key'])
			}
		}

		this.vars.cur_sel = tmp_cats.join('_');

		if (!this.checkLineExists(cat_array)) {
			this.vars.lines.push({
				userKey: 0,
				cat_1: cat_array[0]['cat_key'],
				cat_2: cat_array[1]['cat_key'],
				cat_3: cat_array[2]['cat_key'],
				cat_4: cat_array[3]['cat_key'],
				cat_5: cat_array[4]['cat_key'],
				hours: hours,
				note: ''
			});
		}

		if (hours != null) {
			this.inputFocus(cat_array, '0_hour');
		}

		let convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines);
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet']);
		//this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'autofocus', null);

		this.updateTimesheetTotals();
		this.saveTimesheet();
	}

	inputFocus(cats, suffix) {
		// Determine which input should be highlighted
		this.vars.cur_sel = '';
		var tmp_cats = Array();

		for (var i = 0; i < cats.length; i++) {
			if (cats[i]['cat_key'] != null) {
				tmp_cats.push(cats[i]['cat_key']);
			}
		}

		this.vars.focusInput = 'input_' + tmp_cats.join('_') + '_' + suffix;

		setTimeout(run => {
			$('#' + this.vars.focusInput).focus();
		}, 10);

	}

	checkLineExists(ca) {
		for (var i = 0; i < this.vars.lines.length; i++) {
			var li = this.vars.lines[i];
			if (li['cat_1'] == ca[0]['cat_key'] && li['cat_2'] == ca[1]['cat_key'] && li['cat_3'] == ca[2]['cat_key'] && li['cat_4'] == ca[3]['cat_key'] && li['cat_5'] == ca[4]['cat_key']) {
				return true;
			}
		}
		return false;
	}

	removeLineItem(obj_parent, obj_i, cats) {
		var obj = obj_parent[(obj_i)];
		obj_parent.splice(obj_i, 1);

		var incl = Array();
		for (var i = 0; i < this.vars.lines.length; i++) {
			var el = this.vars.lines[i];
			var incl_el = true;

			if (cats.length == 5) {
				if (el['cat_1'] == cats[0]
					&& el['cat_2'] == cats[1]
					&& el['cat_3'] == cats[2]
					&& el['cat_4'] == cats[3]
					&& el['cat_5'] == cats[4]) {
					incl_el = false;
				}
			} else if (cats.length == 4) {
				if (el['cat_1'] == cats[0]
					&& el['cat_2'] == cats[1]
					&& el['cat_3'] == cats[2]
					&& el['cat_4'] == cats[3]) {
					incl_el = false;
				}
			} else if (cats.length == 3) {
				if (el['cat_1'] == 0) {
					if (el['cat_1'] == cats[0]
						&& el['cat_2'] == cats[1]
						&& el['cat_3'] == cats[2]) {
						incl_el = false;
					}
				} else if (el['cat_1'] == 1) {
					if (el['cat_1'] == cats[0] && el['cat_2'] == cats[1] && el['cat_3'] == cats[2] && el['cat_3'] != 11) {
						incl_el = false;
					}
				}
			} else if (cats.length == 2) {
				if (el['cat_1'] == cats[0]
					&& el['cat_2'] == cats[1]) {
					incl_el = false;
				}
			}
			if (incl_el === true) {
				incl.push(el);
			}
		}

		this.vars.lines = incl;
		var exists = [false, false]

		for (var i = 0; i < this.vars.lines.length; i++) {
			exists[this.vars.lines[i]['cat_1']] = true;
		}

		for (var i = 0; i < exists.length; i++) {
			if (i == 0 && !exists[i]) {
				this.vars.lines.push({
					userKey: 0,
					cat_1: 0,
					cat_2: null,
					cat_3: null,
					cat_4: null,
					cat_5: null,
					hours: null,
					note: ''
				});
			}
		}

		let convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines);
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet']);
		this.updateTimesheetTotals();
		this.saveTimesheet();
	}

	showHideEditLineItems() {
		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);

		if (this.vars.show_edit_line_items) {
			this.vars.show_edit_line_items = false;
			this.vars.edit_line_items = false;
		} else {
			this.vars.show_edit_line_items = true;
			this.vars.edit_line_items = true;
		}
	}

	searchDropDown(phrase, arr, cats) {
		var results = Array();

		phrase = (phrase != undefined) ? phrase.trim().toLowerCase() : phrase = '';

		if (phrase.length <= 0) {
			return results;
		}

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].cat_Title.toLowerCase().indexOf(phrase) != -1 && arr[i].cat_key != -1) {				
				// Only add if not archived
				if(arr[i].archived != 1){
					arr[i].cats = cats;
					results.push(arr[i]);
				}
			}
		}

		if (results.length == 0) {
			results.push({ cat_Title: 'No Results', cat_key: -1 });
		}

		return results;
	}

	dropDownReset(event, dd_results) {

		if (event != false) {
			if (event.target.innerHTML.indexOf('&#9660;') != -1 || event.target.innerHTML.indexOf('▼') != -1) {
				event.target.innerHTML = '&#9650;';
				event = false;				
			} else {
				event.target.innerHTML = '&#9660;';
				event = true;
			}
		}

		if (event) {
			dd_results = Array();
		}

		for (var i = 0; i < dd_results.length; i++) {
			dd_results[i].selected = false;
		}

		return dd_results;
	}

	dropDownKey(event, el, dd_results, cats, level = '') {
		var k_code = event.keyCode;
		var cur_i = -1;

		for (var i = 0; i < dd_results.length; i++) {
			if (dd_results[i].selected == true) {
				cur_i = i;
			}
			dd_results[i].selected = false;
		}

		if (k_code == 13) { // Enter Key  (9 = tab)
			if (cur_i >= 0) {
				if (dd_results[cur_i].cats.length == 1) { // add show					
					if (dd_results[cur_i].cat_key > 0) {
						this.dropDownReset(false, dd_results);
						cats[0].shot_selected = dd_results[cur_i];
						this.addLineItem(cats);
					}
				} else {
					if (level == 'assetTask') {
						cats[cats.length - 1].assetTask = dd_results[cur_i].cat_key
						cats[cats.length - 1].dd_results_assetTask = false;
						cats[cats.length - 1].searchDD_assetTask = dd_results[cur_i].cat_Title
					} else if (level == 'shotTask') {
						cats[cats.length - 1].shotTask = dd_results[cur_i].cat_key
						cats[cats.length - 1].dd_results_shotTask = false;
						cats[cats.length - 1].searchDD_shotTask = dd_results[cur_i].cat_Title
					} else if (level == 'productionTask') {
						cats[cats.length - 1].productionTask = dd_results[cur_i].cat_key
						cats[cats.length - 1].dd_results_productionTask = false;
						cats[cats.length - 1].searchDD_productionTask = dd_results[cur_i].cat_Title
					} else if (level == 'supervisionTask') {
						cats[cats.length - 1].supervisionTask = dd_results[cur_i].cat_key
						cats[cats.length - 1].dd_results_supervisionTask = false;
						cats[cats.length - 1].searchDD_supervisionTask = dd_results[cur_i].cat_Title
					} else if (level == 'showTask') {
						cats[cats.length - 1].showTask = dd_results[cur_i].cat_key
						cats[cats.length - 1].dd_results_showTask = false;
						cats[cats.length - 1].searchDD_showTask = dd_results[cur_i].cat_Title
					} else if (level == 'shot') {
						cats[cats.length - 1].shot_selected = dd_results[cur_i]
						cats[cats.length - 1].dd_results_shot = false;
						cats[cats.length - 1].searchDD_shot = dd_results[cur_i].cat_Title
					}

					this.addRowOptionChanged(dd_results[cur_i].cats, dd_results[cur_i])
				}
			}
		} else {
			this.dropDownReset(false, dd_results)

			for (var i = 0; i < dd_results.length; i++) {
				if (dd_results[i].selected == true) {
					cur_i = i;
				}
				dd_results[i].selected = false;
			}
			if (k_code == 40) { //Key Down				
				if (cur_i + 1 < dd_results.length) {
					cur_i += 1;
				} else {
					cur_i = 0;
				}
				try {
					dd_results[cur_i].selected = true;
				} catch (err) { }
			} else if (k_code == 38) { //Key Up
				if (cur_i == 0) {
					cur_i = dd_results.length - 1;
				} else {
					cur_i -= 1;
				}
				try {
					dd_results[cur_i].selected = true;
				} catch (err) { }
			} else {
				try {
					dd_results[0].selected = true;
				} catch (err) { }
			}
		}
	}

	loadInitTimeheet() {
		// load default lines required for time sheet
		this.vars.lines = this.deepClone(this.serviceService.getInitLines())
		var convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines)
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet']);

		this.vars.ot_sel = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];

		this.vars.submit_date = false;
		this.vars.showCal = false;
		this.vars.timesheet_submitted = false;

		this.updateTimesheetTotals();
		this.addToUndo(this.vars.lines);

		// focus on 'search for show'
		setTimeout(function () {
			$('#input_0').focus();
		}, 10)
	}



	validateOvertime(onSubmit = false) {

		// if salaried employee - don't track overtime 
		if(this.vars.rate_type == 'salary'){
			return true;
		}

		var ot_required = [false, false, false, false, false, false, false];
		var ot_selected = [false, false, false, false, false, false, false];
		var missing = [];
		var ot_check = ['ot', 'dt'];
		var canada_ot = false;

		this.vars.ot_req = [0, 0, 0, 0, 0, 0, 0]

		for (var x = 0; x < this.vars.timesheet.length; x++) {
			for (var x_1 = 0; x_1 < this.vars.timesheet[x].children.length; x_1++) {
				for (var x_2 = 0; x_2 < 7; x_2++) {
					if (this.vars.timesheet[x].children[x_1].sum_hours[x_2] > 0.0) {
						this.vars.ot_req[x_2]++;
					}
				}
			}
		}

		for (var x = 0; x < ot_check.length; x++) {
			var ot_type = ot_check[x];

			for (var i = 0; i < this.vars.timesheet_totals[ot_type].length - 1; i++) {
				var hours = this.vars.timesheet_totals[ot_type][i];

				if (hours > 0.0) {
					// rules differ based on office location
					if (this.vars.current_office == 0) {  // Oakland
						ot_required[i] = true;
					} else if (this.vars.current_office == 1) {  // Montreal
						if (!canada_ot) {
							if (this.vars.timesheet_totals['rt'][i] > 0.0) {
								ot_required[i] = true;
							}
							// when triggered the OT icon will not show up for the remaining days
							canada_ot = true;
						}
					}
				}
			}
		}

		this.vars.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				for (var i = 0; i < element_2.ot.length; i++) {
					if (element_2.ot[i]) {
						ot_selected[i] = element_2.ot[i];
					}
					if (ot_required[i] && element_2.sum_hours[i] > 0.0 && this.vars.timesheet_totals['rt'][i] > 0.0) {
						element_2.ot_req[i] = true;
					} else {
						element_2.ot_req[i] = false;
					}
				}
			});
		});


		// loop through projects to see if OT selection required. 
		for(var i = 0; i < ot_required.length; i ++){
			if(ot_required[i]){
				var total_shows = 0
				
				for(var cat_1 in this.vars.timesheet_totals_byShow){
					for(var cat_2 in this.vars.timesheet_totals_byShow[parseInt(cat_1)]){
						if(this.vars.timesheet_totals_byShow[parseInt(cat_1)][parseInt(cat_2)]['hours'][i] > 0.0){
							total_shows += 1;
						}
					}
				}
				if(total_shows <= 1){
					ot_required[i] = false;
				}
			}
		}
		

		// look at the ot_required and see if a show or department was selected for the specific day, if not, then indicate the day that is missing
		for (var i = 0; i < ot_required.length; i++) {
			if (ot_required[i] && this.vars.ot_sel[i][0] == -1) {
				missing.push(i);
			}
		}

		
		// if the missing length great than 0 and submit time sheet is true, then alert the user that they need to pick a day for OT
		if (missing.length > 0 && onSubmit) {
			var missing_days = []
			missing.forEach(element => {
				missing_days.push(this.serviceService.day_name_full[element])
			});

			this.openPopup('Set Overtime (OT) Options',
				'You need to select which show/department will be assigned OT for the following day(s): <span style="font-weight:700;">'
				+ missing_days.join(', ')
				+ "</span><br><br><span style='font-style:italic;font-size:0.8em;'>Click the OT button on the timesheet for the specific day and show that gets OT assigned to it.</span>"
				, [{ label: 'Close', action: 'closePopup' }]);
			return false;
		}
		return true;
	}

	openPopup(title, text, buttons) {
		this.vars.popup = Object();
		this.vars.popup.text = text;
		this.vars.popup.title = title;
		this.vars.popup.buttons = buttons;
		this.vars.showPopup = true
	}

	

	updateNote(event, obj, cats) {
		obj.note = event.target.value.trim();

		for (var i = 0; i < this.vars.lines.length; i++) {
			var line = this.vars.lines[i]

			if (cats.length == 3) {
				if (cats[0] == line.cat_1 && cats[1] == line.cat_2 && cats[2] == line.cat_3) {
					line.note = obj.note;
				}
			} else if (cats.length == 4) {
				if (cats[0] == line.cat_1 && cats[1] == line.cat_2 && cats[2] == line.cat_3 && cats[3] == line.cat_4) {
					line.note = obj.note;
				}
			} else if (cats.length == 5) {
				if (cats[0] == line.cat_1 && cats[1] == line.cat_2 && cats[2] == line.cat_3 && cats[3] == line.cat_4 && cats[4] == line.cat_5) {
					line.note = obj.note;
				}
			}
		}

		this.saveTimesheet();
	}


	submitTimesheet() {
		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);
		this.vars.edit_line_items = false;
		this.vars.show_edit_line_items = false;

		if (this.validateOvertime(true)) {
			this.openPopup('Confirm Time Sheet Submission',
				'Pressing confirm below indicates that you have completed your timesheet for the currently displayed week. Please contact your manager if you need to make any changes after submission.',
				[{ label: 'Confirm', action: 'confirmTimesheet' }, { label: 'Cancel', action: 'closePopup' }]);
		} else {
			console.log('SUBMIT AND UPDATE STATUS')
			// else option
		}
	}

	//////////////////////////////////////////////////////////////
	//
	// Undo/Redo Functions
	//
	//////////////////////////////////////////////////////////////

	addToUndo(lines) {
		var lines_copy = this.deepClone(lines);  // deep copy to avoid references

		if (this.vars.undo.length > 50) {  // cap number of undos to 50
			this.vars.undo.shift();
		}
		this.vars.undo.push(lines_copy);
	}

	undo() {
		// console.log(this.vars.undo)
		if (this.vars.undo.length > 1) {
			this.loadUndoTimesheet(this.vars.undo[this.vars.undo.length - 2])
			this.vars.undo.pop();
		}
	}

	redo() {
		// console.log('REDO');
		// console.log(this.vars.redo)
	}

	loadUndoTimesheet(lines) {
		this.loadInitTimeheet();

		this.vars.lines = lines;
		let convertLinesToTimeSheet = this.convertLinesToObject(lines);
		this.vars.titles = convertLinesToTimeSheet['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet']);
		this.vars.submit_date = false;

		this.updateTimesheetTotals();
		this.vars.showCal = false;
	}


	//////////////////////////////////////////////////////////////
	//
	// Misc Functions
	//
	//////////////////////////////////////////////////////////////

	isNumberKey(event) {
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		} else {
			return true;
		}
	}

	deepClone(initalObj) {
		var obj = {};
		try {
			obj = JSON.parse(JSON.stringify(initalObj));
		} catch (err) { }

		return obj;
	}

	popupFunction(functionName) {
		this.vars.showPopup = false;

		if (functionName == 'confirmTimesheet') {
			this.vars.timesheet_submitted = true;
			this.vars.status = 1;
			this.vars.rejections = [];
			this.vars.submit_date = this.serviceService.generateDate(new Date());
			this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_note_force', false);
			var data_in = {}
			data_in['week_of'] = this.vars.week_of
			data_in['user_key'] = this.serviceService.delegator_selected

			this.serviceService.updateTimeSheetStatus_db(data_in).subscribe(res => {
			});
			
			var lines_incl = []
			
			for(var x = 0; x < this.vars.lines.length; x++){
				var sum_hours = 0
				if(this.vars.lines[x]['hours'] != null){
					for(var d = 0; d < 7; d++){
						sum_hours += this.vars.lines[x]['hours'][d];
					}
				}
				if(sum_hours > 0){
					lines_incl.push(this.vars.lines[x]);
				}				
			}
			
			this.vars.lines = lines_incl;			
		}
	}

	unsubmitTimesheet() {
		this.serviceService.unsubmitTimeSheetStatus_db(this.vars.week_of).subscribe(res => {			
			this.vars.timesheet_submitted = false;
			var init_lines = this.deepClone(this.serviceService.getInitLines());
			this.vars.lines.push(init_lines[0]);
			init_lines[1].cat_2 = this.vars.department;
			this.vars.lines.push(init_lines[1]);
		});
	}

	label(cat_key, in_array) {
		var label = 'Label';
		for (var i = 0; i < in_array.length; i++) {
			if (in_array[i]['cat_key'] == cat_key) {
				label = in_array[i]['cat_Title'];
			}
		}
		return label;
	}

	resetDropdowns(){


	}
	
	resetMenus(el, prop) {
		var init = false;
		
		if(prop){
			init = el[prop];
		}

		this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);		
		this.serviceService.hideShowDivs(this.vars.timesheet, 'show_note_force', false);

		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_showTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_assetTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_shotTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_productionTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_supervisionTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_departmentTask', false);
		this.serviceService.hideShowDivs(this.vars.timesheet, 'dd_results_shot', false);

		setTimeout(d =>{
			//$('.dd_reveal').html('&#9660;')
		},1000)
		


		if(typeof(init) == 'object'){
			console.log('double here... ')
			el[prop] = init;
			console.log(el)
		}

		if(prop == 'show_menu' || prop == 'show_note_force'){
			el[prop] = (init) ? false : true;
		}


	}
}


