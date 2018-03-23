import { Component, OnInit, Pipe } from '@angular/core';
import { ServiceService } from '../services/service.service'; 
import { TimesheetBreakdownComponent } from '../timesheet-breakdown/timesheet-breakdown.component';
import { ActivatedRoute } from '@angular/router'

import { forEach } from '@angular/router/src/utils/collection';

declare const gapi: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  // store all variables, objects, arrays in this object
  vars = Object();

  constructor(public serviceService: ServiceService, private route:ActivatedRoute) {
    // connection to database functions
    
  }

  ngOnInit() {

    // set some variables    
    this.vars.save_status;
    this.vars.save_status_color;
    this.vars.search_name = '';
    this.vars.search_project = '';
    this.vars.user_focused = false;
    this.vars.user_focused_el = false;
    this.vars.days_label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    this.vars.days = [0, 1, 2, 3, 4, 5, 6]; // Order of days    
    this.vars.day_name_full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.vars.showCal = false
    this.vars.no_timesheets = false;
    this.vars.loading = true;
    this.vars.save_timeout;
    this.vars.showTimeSheet = false;
    this.vars.reject_focus = [];
    this.vars.timesheet_status = Object();
    this.vars.notes = {}

    // peek into users that have yet to submit their timesheets: 
    this.vars.peek = (this.route.snapshot['_routeConfig']['path'] == 'peek') ? true : false;

    // create calendar for current week
    this.vars.calendar = this.serviceService.generateCalendar(new Date());
    this.vars.week_label = this.serviceService.calendarLabel(this.vars.calendar.week_of);

    this.vars.week_of = this.vars.calendar.week_of;


    this.serviceService.validateLogin().subscribe(res => {
      this.serviceService.googleInit();
      

      if (!res['valid']) {
        this.serviceService.show_signin = true
        this.vars.valid_login = false;

        setTimeout(timeout => {
          this.serviceService.logOut()
        }, 5000)
      } else if (!this.serviceService.getCookie('logged_in')) {
        setTimeout(timeout => {
          this.serviceService.logOut()
        }, 500)
      } else {
        this.serviceService.access = res['access'];

        document.cookie = "session=" + res.session;
        document.cookie = "sub=" + res.sub;
        this.serviceService.valid_login = true;
        this.vars.valid_login = true

        this.vars.user_name = res['firstName'] + ' ' + res['lastName'];
        this.vars.userKeyPublic = res['userKey'];

        if (res['firstName'].length == 0 && res['lastName'].length == 0) {
          this.vars.user_name = res['email'];
        }

        // load timesheet and associated shows, departments, and tasks for current week
        
        this.loadWeek(this.vars.week_of);
        this.serviceService.checkLogin()
      }
    });
  }


  loadWeek(week_of) {
    this.vars.showTimeSheet = false;
    this.vars.no_timesheets = false;
    this.vars.loading = true;

    this.vars.timesheet = Array();
    this.vars.timesheet_by_user = Object();
    this.vars.loaded = [];
    this.vars.users = Object()


    // set shots and assets by show objects
    this.vars.shots_byShow = {};
    this.vars.assets_byShow = {};

    // set title object initial state
    this.vars.titles_obj = {
      0: { title: 'Shows', cat_2: {}, cat_3: {}, cat_4: {} },
      1: { title: 'Studio', cat_2: {}, cat_3: {}, cat_4: {} }
    }

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
    });

    this.getShowsDepartmentsTasks()

    // get data from database
    this.serviceService.getUsers_db().subscribe(res => {
      for (var i = 0; i < res['users'].length; i++) {
        var user = res['users'][i];
        this.vars.users[user.public_key] = user;
      }

      var status = (this.vars.peek) ? 0 : 1;

      this.serviceService.getTimeSheetsAllUsers_db(week_of, status).subscribe(res => {


        if(!res['access_granted']){
          this.serviceService.go('entry');
          return false;
        }


        this.vars.payroll_week_of = res['payroll_week_of']

        if(res['payroll_status'] > 0){
          this.vars.period_locked = true
        } else {
          this.vars.period_locked = false
        }

        this.get_payroll_status();

        this.vars.rejections = res['rejections']
        this.vars.approvals = res['approvals']

        for (var i = 0; i < res['timesheets'].length; i++) {
          this.vars.timesheet_status[res['timesheets'][i]['userKey']] = Object()
          this.vars.timesheet_status[res['timesheets'][i]['userKey']]['status'] = res['timesheets'][i]['status']
          this.vars.timesheet_status[res['timesheets'][i]['userKey']]['approved_by'] = res['timesheets'][i]['approved_by']
          this.vars.timesheet_status[res['timesheets'][i]['userKey']]['approved_on'] = res['timesheets'][i]['approved_on']
          this.vars.timesheet_status[res['timesheets'][i]['userKey']]['rejected_by'] = res['timesheets'][i]['rejected_by']
          this.vars.timesheet_status[res['timesheets'][i]['userKey']]['rejected_on'] = res['timesheets'][i]['rejected_on']
        }

        this.vars.lines = res['lines']

        if (this.vars.lines.length > 0) {
          for (var userKeyPublic in res['ot_sel']) {
            this.vars.users[userKeyPublic].ot_sel = res['ot_sel'][userKeyPublic];
          }
          setTimeout(res => {
            this.processTimeSheetData();
            this.vars.showTimeSheet = true;
            this.vars.loading = false
          }, 1000);
        } else {
          this.vars.loading = false
          this.vars.no_timesheets = true;
        }
      });
    });
  }

  get_payroll_status(){
		clearTimeout(this.vars.get_payroll_status_timeout)

		this.serviceService.get_pay_period_lock(this.vars.payroll_week_of).subscribe(res => {
      this.vars.payroll_status = res.status;
      
			if (this.vars.payroll_status > 0) {
        this.vars.period_locked = true
			} else {
        this.vars.period_locked = false
			}

			this.vars.get_payroll_status_timeout = setTimeout(res=>{
				this.get_payroll_status()
			}, 5000)
		});		
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

    });

    // load show list - put into title object
    this.serviceService.getShows_db().subscribe(res => {
      // set vars.shows to res
      this.vars.shows = res;

      for (var i = 0; i < res.length; i++) {
        if (!this.vars.titles_obj[0]['cat_2'].hasOwnProperty(res[i].cat_key)) {
          this.loadShotAssetsForShow(res[i].cat_key);
          this.vars.titles_obj[0]['cat_2'][res[i].cat_key] = { title: '', children: {} };
        }
        this.vars.titles_obj[0]['cat_2'][res[i].cat_key]['title'] = res[i].cat_Title;
      }

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

    });
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
    })

  }



  processTimeSheetData() {
    // convert rows from database into object
    var converted = this.convertLinesToObject(this.vars.lines)   
    var converted_studio = this.convertLinesToObject_studio(this.vars.lines);
    
    // set titles object 
    this.vars.titles = converted['titles'];
    this.vars.titles_studio = converted_studio['titles'];

    // Reset User's Total hours
    for (var user in this.vars.users) {
      this.vars.users[user]['data']['totalHours'] = 0;
      this.vars.users[user]['data']['totalHours_byDay']['t'] = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    
    // generate timesheet structure from timesheet obj
    this.vars.timesheet = this.generateApprovalLayoutObject(converted['timesheet'], this.vars.titles, true);

    // generate timesheet_studio structure from timesheet obj
    this.vars.timesheet_studio = this.generateApprovalLayoutObject(converted_studio['timesheet'], this.vars.titles_studio, false);

    // generate timesheet breakdown for every user
    for (var x in converted['timesheet_by_user']) {

      this.vars.timesheet_by_user[x] = this.serviceService.generateTimesheetByUser(converted['timesheet_by_user'][x])

      var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(this.vars.timesheet_by_user[x], this.vars.users[x].data.totalHours_byDay, this.vars.users[x].officeKey);

      this.vars.users[x].data.timesheet_totals_byShow = totalsOvertimeBreakdown['TotalHours_byShow'];

      var tmp_vars = {
        timesheet_totals_byShow: this.vars.users[x].data.timesheet_totals_byShow,
        timesheet_totals: this.vars.users[x].data.totalHours_byDay,
        ot_sel: this.vars.users[x].ot_sel,
        current_office: this.vars.users[x].officeKey,
        show_ot_breakdown: false
      }

      this.vars.users[x].data.ot_assignment = this.serviceService.overtimeBreakdown(tmp_vars, true);
    }

    // Sum hours
    this.vars.timesheet = this.serviceService.sumHours(this.vars.timesheet);

  }

  // save changes made to approval page (approvals and rejections)
  save() {
    this.vars.save_status = "saving"
    this.vars.save_status_color = "yellow"
    let loc_this = this;

    clearTimeout(this.vars.save_timeout);

    // post to script will occur here once developed

    this.vars.save_timeout = setTimeout(function () {
      loc_this.vars.save_status = "saved";
      loc_this.vars.save_status_color = "green"
    }, 1500)
  }

  // convert db rows(lines) to object
  convertLinesToObject(lines) {
    let timesheet = {};
    let timesheet_by_user = {};
    let titles = {};
    let titles_by_user = {};

    for (var i = 0; i < lines.length; i++) {
      var element = this.vars.lines[i];



      // Go through all of the tTime records and creates a JSON
      try {
        if (!timesheet.hasOwnProperty(element['cat_1']) && element['cat_1'] != null) {
          timesheet[element['cat_1']] = {};
          titles[element['cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']].hasOwnProperty(element['cat_2']) && element['cat_2'] != null) {
          timesheet[element['cat_1']][element['cat_2']] = {};
          titles[element['cat_1']][element['cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']][element['cat_2']].hasOwnProperty(element['userKey']) && element['userKey'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['userKey']] = {};

        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']][element['cat_2']][element['userKey']].hasOwnProperty(element['cat_3']) && element['cat_3'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']] = {};
          titles[element['cat_1']][element['cat_2']][element['cat_3']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']].hasOwnProperty(element['cat_4']) && element['cat_4'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']][element['cat_4']] = {};
          titles[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']][element['cat_4']].hasOwnProperty(element['cat_5']) && element['cat_5'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']][element['cat_4']][element['cat_5']] = {};
          titles[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']] = {};
        }
      } catch (err) { }





      // Timesheet by user
      try {
        if (!timesheet_by_user.hasOwnProperty(element['userKey']) && element['userKey'] != null) {
          timesheet_by_user[element['userKey']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['userKey']].hasOwnProperty(element['cat_1']) && element['cat_1'] != null) {
          timesheet_by_user[element['userKey']][element['cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['userKey']][element['cat_1']].hasOwnProperty(element['cat_2']) && element['cat_2'] != null) {
          timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']].hasOwnProperty(element['cat_3']) && element['cat_3'] != null) {
          timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']].hasOwnProperty(element['cat_4']) && element['cat_4'] != null) {
          timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']].hasOwnProperty(element['cat_5']) && element['cat_5'] != null) {
          timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']] = {};
        }
      } catch (err) { }

      // add hours to timesheet object
      if (element['cat_5'] != null) {
        timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']][element['cat_4']][element['cat_5']]['hours'] = element['hours'];
        timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']]['hours'] = element['hours'];
        this.vars.notes[element['cat_1']+'_'+element['cat_2']+'_'+element['userKey']+'_'+element['cat_3']+'_'+element['cat_4']+'_'+element['cat_5']] = (element['note'].trim().length > 0) ? element['note']: false;
      } else if (element['cat_4'] != null) {
        timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']][element['cat_4']]['hours'] = element['hours'];
        this.vars.notes[element['cat_1']+'_'+element['cat_2']+'_'+element['userKey']+'_'+element['cat_3']+'_'+element['cat_4']] = (element['note'].trim().length > 0) ? element['note']: false;
        timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']]['hours'] = element['hours'];
      } else if (element['cat_3'] != null) {
        timesheet[element['cat_1']][element['cat_2']][element['userKey']][element['cat_3']]['hours'] = element['hours'];
        timesheet_by_user[element['userKey']][element['cat_1']][element['cat_2']][element['cat_3']]['hours'] = element['hours'];
        this.vars.notes[element['cat_1']+'_'+element['cat_2']+'_'+element['userKey']+'_'+element['cat_3']] = (element['note'].trim().length > 0) ? element['note'] : false;
      }

      //this.vars.notes
      

      // Adds titles to title JSON
      try {
        if (element['cat_3'] == 4) {
          titles[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']]['title'] = this.vars.assets_byShow[element['cat_2']][element['cat_5']]['cat_Title']
        } else if (element['cat_3'] == 5) {
          titles[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']][element['cat_5']]['title'] = this.vars.shots_byShow[element['cat_2']][element['cat_5']]['cat_Title'];
        }

      } catch (err) { }

      try {
        titles[element['cat_1']][element['cat_2']][element['cat_3']][element['cat_4']]['title'] = this.vars.titles_obj[element['cat_1']]['cat_4'][element['cat_4']]['title'];
      } catch (err) { }

      try {
        titles[element['cat_1']][element['cat_2']][element['cat_3']]['title'] = this.vars.titles_obj[element['cat_1']]['cat_3'][element['cat_3']]['title'];
      } catch (err) { }

      try {
        titles[element['cat_1']][element['cat_2']]['title'] = this.vars.titles_obj[element['cat_1']]['cat_2'][element['cat_2']]['title'];
      } catch (err) { }

      try {
        titles[element['cat_1']]['title'] = this.vars.titles_obj[element['cat_1']]['title'];
      } catch (err) { }
    }


    return { timesheet: timesheet, titles: titles, timesheet_by_user: timesheet_by_user, titles_by_user: titles_by_user }
  }



  // convert db rows(lines) to object
  convertLinesToObject_studio(lines) {
    let timesheet = {};
    let timesheet_by_user = {};
    let titles = {};
    let titles_by_user = {};

    for (var i = 0; i < lines.length; i++) {
      var element = this.vars.lines[i];


      // Go through all of the tTime records and creates a JSON
      try {
        if (!timesheet.hasOwnProperty(element['cat_1']) && element['cat_1'] != null) {
          timesheet[element['cat_1']] = {};
          titles[element['cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']].hasOwnProperty(element['cat_2']) && element['cat_2'] != null) {
          timesheet[element['cat_1']][element['cat_2']] = {};
          titles[element['cat_1']][element['cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['cat_1']][element['cat_2']].hasOwnProperty(element['cat_3']) && element['cat_3'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['cat_3']] = {};
          titles[element['cat_1']][element['cat_2']][element['cat_3']] = {};
        }
      } catch (err) { }


      try {
        if (!timesheet[element['cat_1']][element['cat_2']][element['cat_3']].hasOwnProperty(element['userKey']) && element['userKey'] != null) {
          timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['userKey']] = {};
          titles[element['cat_1']][element['cat_2']][element['cat_3']][element['userKey']] = {};
        }
      } catch (err) { }

      // add hours to timesheet object
      if (element['cat_3'] != null) {
        timesheet[element['cat_1']][element['cat_2']][element['cat_3']][element['userKey']]['hours'] = element['hours'];
      }

      // Adds titles to title JSON
      try {
        titles[element['cat_1']][element['cat_2']][element['cat_3']]['title'] = this.vars.titles_obj[element['cat_1']]['cat_3'][element['cat_3']]['title'];
      } catch (err) { }

      try {
        titles[element['cat_1']][element['cat_2']]['title'] = this.vars.titles_obj[element['cat_1']]['cat_2'][element['cat_2']]['title'];
      } catch (err) { }

      try {
        titles[element['cat_1']]['title'] = this.vars.titles_obj[element['cat_1']]['title'];
      } catch (err) { }
    }

    return { timesheet: timesheet, titles: titles }
  }


  // creates an object used to layout the approval information
  generateApprovalLayoutObject(timesheet_in, titles_in, sum_user_hours) {
    let children = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    // set variable
    var timesheet_out = Array();

    for (var prop_1 in timesheet_in) {
      if (prop_1 != 'hours') {
        children[1] = [];  // rest children
        //children[1].push({ title: '__title_1__', cat_key: prop_1, cat_level: 1, hours: timesheet[prop_1]['hours'], children: children[2] })

        for (var prop_2 in timesheet_in[prop_1]) {
          if (prop_2 != 'hours') {
            children[2] = [];  // reset children
            children[1].push({ title: '', cat_key: prop_2, hours: timesheet_in[prop_1][prop_2]['hours'], children: children[2] });

            for (var prop_3 in timesheet_in[prop_1][prop_2]) {
              var ot = [false, false, false, false, false, false, false];

              var rejected = false
              var rejected_by = false
              var rejected_on = false

              if (prop_3.indexOf('-') != -1) {
                if (this.vars.timesheet_status[prop_3]['status'] == 2) {
                  rejected = true
                  rejected_by = this.vars.timesheet_status[prop_3]['rejected_by'];
                  rejected_on = this.vars.timesheet_status[prop_3]['rejected_on'];
                }
              }

              if (prop_3 != 'hours') {
                children[3] = [];  // reset children
                children[2].push({
                  title: '',
                  cat_key: prop_3,
                  children: children[3],
                  rejected: rejected,
                  rejected_by: rejected_by,
                  rejected_on: rejected_on,
                  rejected_note: '',
                  rejected_note_department: '',
                  rejected_hover: false,
                  approved: false,
                  approved_by: false,
                  approved_date: false,
                  showNote: false
                })

                if (sum_user_hours) {
                  this.vars.users[prop_3] = this.sumArrayhours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3]['hours']);
                }

                for (var prop_4 in timesheet_in[prop_1][prop_2][prop_3]) {


                  var rejected = false
                  var rejected_by = false

                  if (prop_4.indexOf('-') != -1) {
                    if (this.vars.timesheet_status[prop_4]['status'] == 2) {
                      rejected = true
                      rejected_by = this.vars.timesheet_status[prop_4]['rejected_by'];
                    }
                  }



                  if (prop_4 != 'hours') {
                    children[4] = [];  // reset children
                    children[3].push({
                      title: '',
                      cat_key: prop_4, note: '',
                      hours: timesheet_in[prop_1][prop_2][prop_3][prop_4]['hours'],
                      children: children[4],
                      showNote: false,
                      ot: ot,
                      rejected: rejected,
                      rejected_by: rejected_by,
                      rejected_note: '',
                      rejected_note_department: '',
                      rejected_hover: false,
                      approved: false,
                      approved_by: false,
                      approved_date: false
                    });

                    if (sum_user_hours) {
                      this.vars.users[prop_3] = this.sumArrayhours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4]['hours']);
                    }
                    for (var prop_5 in timesheet_in[prop_1][prop_2][prop_3][prop_4]) {
                      if (prop_5 != 'hours') {
                        children[5] = [];
                        children[4].push({
                          title: '',
                          cat_key: prop_5, note: '',
                          hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['hours'],
                          children: children[5],
                          showNote: false,
                          ot: ot
                        });

                        if (sum_user_hours) {
                          this.vars.users[prop_3] = this.sumArrayhours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['hours']);
                        }
                        for (var prop_6 in timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]) {
                          if (prop_6 != 'hours') {
                            children[5].push({
                              title: '',
                              cat_key: prop_6, note: '',
                              hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['hours'],
                              children: [],
                              showNote: false,
                              ot: ot
                            });
                            if (sum_user_hours) {
                              this.vars.users[prop_3] = this.sumArrayhours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['hours']);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      timesheet_out.push({
        title: titles_in[prop_1].title,
        cat_key: prop_1,
        children: children[1]
      });
    }
    return timesheet_out;
  }

  // sums hours in array that is passed into it
  sumArrayhours(user_data_in, array_in) {
    var user_data_out = user_data_in;

    try {
      for (var i = 0; i < array_in.length; i++) {
        user_data_out['data']['totalHours'] += array_in[i];
        user_data_out['data']['totalHours_byDay']['t'][i] += array_in[i];  // untouched hours
        user_data_out['data']['totalHours_byDay']['rt'][i] += array_in[i];
        user_data_out['data']['totalHours_byDay']['rt'][7] += array_in[i];
      }
    } catch (err) { }

    //var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(false, user_data_out['data'], user_data_out['officeKey']);
    //user_data_out['data'].timesheet_totals_byShow = totalsOvertimeBreakdown['totalHours_byShow'];

    return user_data_out
  }

  // approves selected row item 
  rowApproved(event, el, cats) {
    this.vars.user_focused_el = el;
    this.vars.user_focused = false;
    this.vars.cats = cats

    if(cats.length == 3){
      var index = cats[0]['cat_key']+'_'+cats[1]['cat_key']+'_'+cats[2]['cat_key']  
    } else {
      var index = cats[0]['cat_key']+'_'+cats[1]['cat_key']+'_'+cats[2]['cat_key']+'_'+cats[3]['cat_key']
    }

    var cur_approved = (this.vars.approvals.hasOwnProperty(index)) ? true : false;

    this.hideBreakdowns();

    if (cur_approved) {
      this.vars.showPopup_unapproval = true;
    } else {
      this.save();
      var data = Object();

      data.week_of = this.vars.week_of;
      data.approved_by = this.vars.userKeyPublic;
      data.approved_on = new Date();

      data.cat1 = cats[0].cat_key
      data.cat2 = cats[1].cat_key

      if (cats.length == 3) {
        data.cat3 = null
        data.userKeyPublic = cats[2].cat_key
      } else {
        data.cat3 = cats[2].cat_key
        data.userKeyPublic = cats[3].cat_key
      }

      this.vars.approvals[index] = {}
      this.vars.approvals[index]['approved_by'] = this.vars.user_name;
      this.vars.approvals[index]['approved_on'] = new Date();

      this.serviceService.approveTimeSheetLine(data).subscribe(res => {        
      });
    }
  }

  hideBreakdowns() {
    this.vars.user_focused = false;
    this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'breakdown_show', false)
    this.vars.timesheet_studio = this.serviceService.hideShowDivs(this.vars.timesheet_studio, 'breakdown_show', false)
  }

  // rejects selected row item
  rowRejectedConfirm(el, cats) {
    this.vars.reject_focus = cats
    
    if(cats.length == 3){
      var index = cats[2]['cat_key']  
    } else {
      var index = cats[3]['cat_key']
    }

    var cur_approved = (this.vars.rejections.hasOwnProperty(index)) ? true : false;

    //this.vars.rejections[x_3.cat_key]

    if (!cur_approved) {
      this.vars.showPopup_reject_text_artist = false;
      this.vars.showPopup_reject_text_department = false;
      this.vars.user_focused_el = el;
      this.vars.showPopup_reject = true;
    }
  }

  // rejects selected row item
  rowRejected(y) {
    var cats = this.vars.reject_focus;
    
    var data = Object();
    data.week_of = this.vars.week_of;
    data.userKeyPlubic = this.vars.user_focused_el['cat_key'];
    data.rejected_by = this.vars.userKeyPublic;
    data.rejected_on = new Date();

    data.rejectedNote_artist = (this.vars.showPopup_reject_text_artist) ? this.vars.showPopup_reject_text_artist.trim() : '';
    data.rejectedNote_department = (this.vars.showPopup_reject_text_department) ? this.vars.showPopup_reject_text_department.trim() : '';

    data.cat1 = cats[0].cat_key
    data.cat2 = cats[1].cat_key

    if (cats.length == 3) {
      data.cat3 = null
      data.userKeyPublic = cats[2].cat_key
    } else {
      data.cat3 = cats[2].cat_key
      data.userKeyPublic = cats[3].cat_key      
    }

    this.vars.rejections[data.userKeyPublic] = {}
    this.vars.rejections[data.userKeyPublic]['rejected_on'] = new Date()
    this.vars.rejections[data.userKeyPublic]['rejected_by'] = this.vars.user_name
    this.vars.rejections[data.userKeyPublic]['rejectedNote_artist'] = data.rejectedNote_artist;
    this.vars.rejections[data.userKeyPublic]['rejectedNote_department'] = data.rejectedNote_department;

    if(cats[0].cat_key == 1){
      this.vars.rejections[data.userKeyPublic]['show_dept_name'] = this.vars.titles_obj[data.cat1]['cat_2'][data.cat2]['title'] + ': ' + this.vars.titles_obj[data.cat1]['cat_3'][data.cat3]['title'];
    } else {
      this.vars.rejections[data.userKeyPublic]['show_dept_name'] = this.vars.titles_obj[data.cat1]['cat_2'][data.cat2]['title']
    }
    

    console.log('reject line item: ')
    console.log(data)
    
    this.serviceService.rejectTimeSheetLine(data).subscribe(res => {
      console.log(res)
    });


    this.vars.showPopup_reject = false;
    this.save();
  }

  // toggle the timesheet view for the selected user
  toggleBreakdown(event, userKey, el) {
    var cur_state = el.breakdown_show;
    this.hideBreakdowns();

    if (cur_state) {
      el.breakdown_show = false;
      this.vars.user_focused = false;
    } else {
      el.breakdown_show = true;
      this.vars.user_focused = userKey;
    }
  }


  updateNote(event, to) {
    if (to == 'artist') {
      this.vars.showPopup_reject_text_artist = event.target.value;
    } else {
      this.vars.showPopup_reject_text_department = event.target.value;
    }
  }

  // close popup window that opened when the user pressed the rejection button
  unapprovalConfirmed(event) {
    var cats = this.vars.cats    
    var data = Object();

    data.week_of = this.vars.week_of;
    data.approved_by = this.vars.userKeyPublic;
    data.approved_on = new Date();

    data.cat1 = cats[0].cat_key
    data.cat2 = cats[1].cat_key

    if (cats.length == 3) {
      data.cat3 = null
      data.userKeyPublic = cats[2].cat_key
    } else {
      data.cat3 = cats[2].cat_key
      data.userKeyPublic = cats[3].cat_key
    }
  

    if(cats.length == 3){
      var index = cats[0]['cat_key']+'_'+cats[1]['cat_key']+'_'+cats[2]['cat_key']  
    } else {
      var index = cats[0]['cat_key']+'_'+cats[1]['cat_key']+'_'+cats[2]['cat_key']+'_'+cats[3]['cat_key']
    }

    delete this.vars.approvals[index];

    this.serviceService.unapproveTimeSheetLine(data).subscribe(res => {
    })

    this.vars.showPopup_unapproval = false;
    this.save();
  }

  closePopup() {
    this.vars.showPopup_unapproval = false;
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
    this.loadWeek(this.vars.week_of)
  }


  sumArray(in_array) {
    var total = 0;
    in_array[7] = 0;

    for (var i_i = 0; i_i < 7; i_i++) {
      total += in_array[i_i];
      in_array[7] += in_array[i_i];
    }

    return total;
  }

  hasOT(array_in, cat_1, cat_2, day) {
    for (var i = 0; i < array_in.length; i++) {

      if (array_in[i].day == day && array_in[i].cat_1 == cat_1 && array_in[i].cat_2 == cat_2) {

        return array_in[i].hours;
      }
    }
    return false
  }
}