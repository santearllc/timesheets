// 
// AUTHOR: Tyler Cote
// EMAIL: tyler@santear.com
// 
// nOTE: Using the following index for days of week; 0 = Monday; 
// functions : camelCase
// variables: lowercase, separate_words_with_underscore 
//
// the data in this file will be replaced with responses from sql database in next stage. 

import { Injectable } from '@angular/core';
import { Line } from '../models/Line';
import { Http } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';


declare const gapi: any;

@Injectable()
export class ServiceService {
  lines: Line[];
  lines_sample: Line[];
  lines_init: Line[];
  lines_approval: Line[];
  shot_tasks = [];
  asset_tasks = [];
  production_tasks = [];
  supervision_tasks = [];
  project_tasks = [];
  department_tasks = [];
  shots = [];
  assets = [];
  projects = [];
  departments = [];
  users = Object();
  mo_text = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  mo_text_long = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  day_name_full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days_label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  api_path;
  valid_login = false;
  show_signin = false;
  access = { 0 : false, 1 : false, 2 : false, 3 : false, 4 : false, 5 : false, 6 : false }

  login_res = '';
  googleLoginButtonId = "googleBtn";
  


  go(to) {
    this.router.navigate(['../'+to], { relativeTo: this.route });
  }


  constructor(public http: Http, private router: Router, private route: ActivatedRoute) {

    this.api_path = 'http://atomicfiction.xyz';


    this.lines_init = [
      {
        userKey: 0,
        cat_1: 0,
        cat_2: null,
        cat_3: null,
        cat_4: null,
        cat_5: null,
        hours: null,
        note: ''
      },
      {
        userKey: 0,
        cat_1: 1,
        cat_2: 0,
        cat_3: 11,
        cat_4: null,
        cat_5: null,
        hours: [0, 0, 0, 0, 0, 0, 0],
        note: ''
      }
    ];
  }

  // Google login api 
  public auth2: any;

  googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '697253707156-snm8bjc71kb1i7qac4goakajkr53f1m5.apps.googleusercontent.com',        
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      that.attachSignin(document.getElementById('googleBtn'));
    });


  }

  attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {       
        var profile = googleUser.getBasicProfile();        
        that.show_signin = false
        let id_token = googleUser.getAuthResponse().id_token;
        document.cookie = "logged_in=True";
        document.cookie = "id_token=" + id_token;
        that.valid_login = true
        that.go('entry');
      }, function (error) {
          // error
      });

      // If logged in, then go to entry page
      setTimeout(res =>{
        if(this.auth2.isSignedIn.get()){
          var is_root = (location.pathname == "/" || location.pathname == "/login") ? true : false; 
          if(is_root){
            that.go('entry');
          }
        }
      }, 500)        
  }

  
  validateLogin() {
    var id_token = this.getCookie('id_token')
    var data = { 'id_token': id_token }
    return this.http.post(this.api_path + '/api/user/validate', data).map(res => res.json());
  }


  checkLogin(){    
    if(!this.getCookie('logged_in')){
      this.go('login')
      this.valid_login = false
      return false
    }
    setTimeout(res=> {
      this.checkLogin()
    },1000)
  }

  logOut(){    
    var auth2 = gapi.auth2.getAuthInstance();    
    var that = this
    this.auth2.signOut().then(function () {
      document.cookie = "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      that.go('login');
      that.access = { 0 : false, 1 : false, 2 : false, 3 : false, 4 : false, 5 : false, 6 : false }
    }); 
  }
  


  getApprovalLines() {
    return this.lines_approval;
  }

  getInitLines() {
    return Object.assign([], this.lines_init);
  }

  updatesBambooUsers() {
    return this.http.get(this.api_path + '/api/users/updateBamboo').map(res => res.json());
  }

  getDepartments_db() {
    return this.http.get(this.api_path + '/api/department').map(res => res.json());
  }

  getShows_db() {
    return this.http.get(this.api_path + '/api/show').map(res => res.json());
  }

  getTasks_db() {
    return this.http.get(this.api_path + '/api/task').map(res => res.json());
  }

  getAssets_db(show_key) {
    return this.http.get(this.api_path + '/api/show/' + show_key + '/asset')
      .map(res => res.json());
  }

  getShots_db(show_key) {
    return this.http.get(this.api_path + '/api/show/' + show_key + '/shot')
      .map(res => res.json());
  }

  getUsers_db() {
    return this.http.get(this.api_path + '/api/user')
      .map(res => res.json());
  }

  getTimeSheet_db(data) {
    return this.http.get(this.api_path + '/api/timesheet?userKey='+data['user_key']+'&weekStart=' + data['week_of'] + '&' + this.session_param('get'))
      .map(res => res.json());
  }

  getTimeSheetsAllUsers_db(week_of,status) {
    return this.http.get(this.api_path + '/api/timesheets/'+week_of+'?status='+status+'&' + this.session_param('get'))
      .map(res => res.json());
  }


  rejectTimeSheetLine(data) {
    return this.http.post(this.api_path + '/api/timesheet/line/reject?' + this.session_param('get'), data)
      .map(res => res.json());
  }
  
  approveTimeSheetLine(data) {
    return this.http.post(this.api_path + '/api/timesheet/line/approve?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  unapproveTimeSheetLine(data) {
    return this.http.post(this.api_path + '/api/timesheet/line/unapprove?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  updateTimeSheetStatus_db(data_in) {
    var data = Object();
    data = this.session_param(data)
    data.week_of = data_in['week_of']
    data.user_key = data_in['user_key']

    return this.http.put(this.api_path + '/api/timesheet/' + data['week_of'] + '/status', data)
      .map(res => res.json());
  }

  unsubmitTimeSheetStatus_db(week_of) {
    var data = Object();
    data = this.session_param(data)
    data.week_of = week_of

    return this.http.put(this.api_path + '/api/timesheet/' + week_of + '/unsubmit', data)
      .map(res => res.json());
  }


  saveTimeSheet(data, week_of) {
    data.session = this.getCookie('session')
    data.sub = this.getCookie('sub')
    data.id_token = this.getCookie('id_token')
    data.weekStart = week_of
    return this.http.post(this.api_path + '/api/timesheet', data)
      .map(res => res.json());
  }

  geStatuses_db(week_of) {
    return this.http.get(this.api_path + '/api/timesheets/status/'+ week_of)
      .map(res => res.json());
  }

  
  // admin page
  getDelegates(userKey) {
    return this.http.get(this.api_path + '/api/delegate?userKey=' + userKey)
      .map(res => res.json());
  }

  addDelegate(data) {
    return this.http.post(this.api_path + '/api/delegate/add?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  removeDelegate(data) {
    return this.http.post(this.api_path + '/api/delegate/remove?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  getApprovers(params) {
    return this.http.get(this.api_path + '/api/approver?' + params)
      .map(res => res.json());
  }

  addApprover(data) {
    return this.http.post(this.api_path + '/api/approver/add?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  removeApprover(data) {
    return this.http.post(this.api_path + '/api/approver/remove?' + this.session_param('get'), data)
      .map(res => res.json());
  }
  
  getCustomWeek(year) {
    return this.http.get(this.api_path + '/api/customweek?year=' + year +'&' + this.session_param('get'))
      .map(res => res.json());
  }

  addCustomWeek(data) {
    return this.http.post(this.api_path + '/api/customweek/add?' + this.session_param('get'), data)
      .map(res => res.json());
  }


  // Payroll Period
  pay_periods() {
    return this.http.get(this.api_path + '/api/payperiods?')
      .map(res => res.json());
  }

  pay_period_lock(data) {
    return this.http.post(this.api_path + '/api/payperiod/lock?' + this.session_param('get'), data)
      .map(res => res.json());
  }

  get_pay_period_lock(week_of){
    return this.http.get(this.api_path + '/api/payperiod/lock?weekOf='+week_of+'&' + this.session_param('get'))
      .map(res => res.json());
  }



  
  session_param(data) {
    if (data == 'get') {
      var param = 'session=' + this.getCookie('session') + '&sub=' + this.getCookie('sub')
      return param
    } else {
      data.session = this.getCookie('session')
      data.sub = this.getCookie('sub')
      data.id_token = this.getCookie('id_token')
      return data
    }
  }

  

  sumHours(data_in) {
    var data_out = data_in;

    
    try {
      for (var i_1 = 0; i_1 < data_out.length; i_1++) {
        var obj_1 = data_out[i_1];
        for (var i_2 = 0; i_2 < obj_1.children.length; i_2++) {
          var obj_2 = obj_1.children[i_2];
          for (var i_3 = 0; i_3 < obj_2.children.length; i_3++) {
            var sum_hours = [0, 0, 0, 0, 0, 0, 0];
            var obj_3 = obj_2.children[i_3];            
            for (var i_4 = 0; i_4 < obj_3.children.length; i_4++) {
              var obj_4 = obj_3.children[i_4];
              if (obj_4['hours'] != undefined) {
                for (var hr = 0; hr < 7; hr++) {
                  sum_hours[hr] += obj_4['hours'][hr];
                }
              }
              for (var i_5 = 0; i_5 < obj_4.children.length; i_5++) {
                var obj_5 = obj_4.children[i_5];

                if (obj_5['hours'] != undefined) {
                  for (var hr = 0; hr < 7; hr++) {
                    sum_hours[hr] += obj_5['hours'][hr];
                  }
                }
                for (var i_6 = 0; i_6 < obj_5.children.length; i_6++) {
                  var obj_6 = obj_5.children[i_6];
                  for (var hr = 0; hr < 7; hr++) {
                    sum_hours[hr] += obj_6['hours'][hr];
                  }
                }
              }
            }
            obj_3.sum_hours = sum_hours;
          }
        }
      }
    } catch (err) { }


    return data_out;
  }

  generateTimesheetByUser(timesheet_in) {
    let children = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    var timesheet_out = Array();

    for (var prop_1 in timesheet_in) {
      if (!isNaN(parseInt(prop_1))) {
        children[1] = [];  // rest children				
        for (var prop_2 in timesheet_in[prop_1]) {
          if (!isNaN(parseInt(prop_2))) {
            children[2] = [];  // reset children

            children[1].push({
              cat_key: prop_2,
              sum_hours: [0, 0, 0, 0, 0, 0, 0],
              ot: [false, false, false, false, false, false, false],
              ot_req: [false, false, false, false, false, false, false],
              note: timesheet_in[prop_1][prop_2]['note'],
              hours: timesheet_in[prop_1][prop_2]['hours'],
              focus: [false, false, false, false, false, false, false],
              children: children[2],
              projectTask: -1,
              departmentTask: -1, 
              show_menu : false,
              show_note_force : false,
              dd_results_showTask: false
            });
            for (var prop_3 in timesheet_in[prop_1][prop_2]) {
              if (!isNaN(parseInt(prop_3))) {
                children[3] = [];  // reset children
                children[2].push({
                  cat_key: prop_3,
                  note: timesheet_in[prop_1][prop_2][prop_3]['note'],
                  hours: timesheet_in[prop_1][prop_2][prop_3]['hours'],
                  focus: [false, false, false, false, false, false, false],
                  children: children[3],
                  productionTask: -1, 
                  show_menu : false,
                  show_note_force : false,
                  dd_results_showTask: false
                });
                for (var prop_4 in timesheet_in[prop_1][prop_2][prop_3]) {
                  if (!isNaN(parseInt(prop_4))) {
                    children[4] = [];  // reset children
                    children[3].push({
                      cat_key: prop_4,
                      note: timesheet_in[prop_1][prop_2][prop_3][prop_4]['note'],
                      hours: timesheet_in[prop_1][prop_2][prop_3][prop_4]['hours'],
                      focus: [false, false, false, false, false, false, false],
                      children: children[4],
                      productionTask: -1, 
                      show_menu : false,
                      show_note_force : false
                    });
                    for (var prop_5 in timesheet_in[prop_1][prop_2][prop_3][prop_4]) {
                      if (!isNaN(parseInt(prop_5))) {
                        children[4].push({
                          cat_key: prop_5,
                          note: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['note'],
                          hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['hours'],
                          focus: [false, false, false, false, false, false, false],
                          children: [],
                          productionTask: -1, 
                          show_menu : false,
                          show_note_force : false
                        });
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
        cat_key: prop_1,
        note: '',
        hours: timesheet_in[prop_1]['hours'],
        children: children[1],
      });
    }
    return timesheet_out;
  }

  generateDate(date_in) {

    var dateObj = new Date(date_in);
    var mo = dateObj.getUTCMonth(); //months from 1-12
    var da = dateObj.getUTCDate();
    var yr = dateObj.getUTCFullYear();

    return this.mo_text[mo] + ' ' + da + ', ' + yr;;
  }

  hideShowDivs(timesheet, prop_sel, bool_set) {

    for (var x_1 in timesheet) {
      try {
        timesheet[x_1][prop_sel] = bool_set;
      } catch (err) { }
      for (var x_2 in timesheet[x_1]['children']) {
        try {
          timesheet[x_1]['children'][x_2][prop_sel] = bool_set;
        } catch (err) { }
        for (var x_3 in timesheet[x_1]['children'][x_2]['children']) {
          try {
            timesheet[x_1]['children'][x_2]['children'][x_3][prop_sel] = bool_set;
          } catch (err) { }
          for (var x_4 in timesheet[x_1]['children'][x_2]['children'][x_3]['children']) {
            try {
              timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4][prop_sel] = bool_set;
            } catch (err) { }
            for (var x_5 in timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children']) {
              try {
                timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5][prop_sel] = bool_set;
              } catch (err) { }
            }
          }
        }
      }
    }
    return timesheet;
  }

  totalsOvertimeBreakdown(timesheet, totals_in, office_key) {
    var totals_out = Object.assign([], totals_in);
    var entry_page = false;


    // Get totals by Show/Department
    var by_show = { 0: {}, 1: {} };

    for (var x_1 = 0; x_1 < timesheet.length; x_1++) {
      for (var x_2 = 0; x_2 < timesheet[x_1]['children'].length; x_2++) {
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']] = {};
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'] = [0, 0, 0, 0, 0, 0, 0, 0];
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['ot'] = timesheet[x_1]['children'][x_2]['ot'];

        for (var x_3 = 0; x_3 < timesheet[x_1]['children'][x_2]['children'].length; x_3++) {
          if (timesheet[x_1]['children'][x_2]['children'][x_3]['hours']) {
            for (var d = 0; d < 7; d++) {
              by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['hours'][d];
              by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['hours'][d];
            }
          }
          for (var x_4 = 0; x_4 < timesheet[x_1]['children'][x_2]['children'][x_3]['children'].length; x_4++) {
            if (timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours']) {
              for (var d = 0; d < 7; d++) {
                by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours'][d];
                by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours'][d];
              }
            }
            for (var x_5 = 0; x_5 < timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'].length; x_5++) {
              if (timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours']) {
                for (var d = 0; d < 7; d++) {
                  by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours'][d];
                  by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours'][d];
                }
              }
            }
          }
        }
      }
    }

    totals_out['TotalHours_byShow'] = by_show;

    if (!totals_out.hasOwnProperty('TotalHours_byDay')) {
      totals_out['TotalHours_byDay'] = totals_out;
      totals_out['TotalHours_byDay']['t'] = totals_out['TotalHours_byDay']['rt'];
      entry_page = true;
    }

    //Reset OT Totals
    totals_out['TotalHours_byDay']['rt'][7] = 0;
    totals_out['TotalHours_byDay']['ot'][7] = 0;
    totals_out['TotalHours_byDay']['dt'][7] = 0;

    if (office_key == 0) { // California Rules 
      var cons_days = 0;  // counter for continous days 

      for (var i = 0; i < 7; i++) {
        var d_h = totals_out['TotalHours_byDay']['t'][i];  // hours for the current day

        if (d_h > 0.0) {
          cons_days++;
        } else {
          cons_days = 0;
        }

        if (cons_days == 7) {
          totals_out['TotalHours_byDay']['rt'][i] = 0;

          if (d_h <= 8) {
            totals_out['TotalHours_byDay']['ot'][i] = d_h;

            // Update grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += d_h;

          } else {
            totals_out['TotalHours_byDay']['dt'][i] = d_h - 8;
            totals_out['TotalHours_byDay']['ot'][i] = 8;

            //Update Grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['dt'][7] += totals_out['TotalHours_byDay']['dt'][i];
          }
        } else {
          if (d_h > 8 && d_h <= 12) {
            totals_out['TotalHours_byDay']['ot'][i] = totals_out['TotalHours_byDay']['t'][i] - 8;
            totals_out['TotalHours_byDay']['rt'][i] = 8;

            // Update grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['t'][i];

          } else if (d_h > 12) {
            totals_out['TotalHours_byDay']['dt'][i] = totals_out['TotalHours_byDay']['t'][i] - 12;
            totals_out['TotalHours_byDay']['ot'][i] = 4;
            totals_out['TotalHours_byDay']['rt'][i] = 8;

            //Update Grand Totals
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['rt'][i];
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['dt'][7] += totals_out['TotalHours_byDay']['dt'][i];
          } else {
            // Update Grand Totals
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['rt'][i];
          }
        }
      }
    } else {  // Canada Rules
      let cur_total = 0;
      let ot_triggerd = false;

      // go through every day... 
      for (var i = 0; i < 7; i++) {

        var d_h = totals_out['TotalHours_byDay']['t'][i]; // set current day hours         
        cur_total += d_h
        var hours_rt = 0;
        var hours_ot = 0;

        // Check to see if the current total hours are greater than 40 and that there are hours record for the current day				
        if (cur_total > 40 && totals_out['TotalHours_byDay']['rt'][i] > 0) {
          hours_rt = 0;
          hours_ot = 0;

          if (ot_triggerd) {  // This day is all OT hours
            totals_out['TotalHours_byDay']['rt'][i] = 0.0;
            hours_ot = d_h;
          } else {
            hours_ot = cur_total - 40;

            if (hours_ot < d_h) { //This day has both RT and OT
              hours_rt = d_h - hours_ot;
            }

            // Update the timesheet_totals
            totals_out['TotalHours_byDay']['rt'][i] = hours_rt;

            // Next day will be all OT hours
            ot_triggerd = true;
          }
          totals_out['TotalHours_byDay']['ot'][i] = hours_ot;
          totals_out['TotalHours_byDay']['ot'][7] += hours_ot;
        } else {
          totals_out['TotalHours_byDay']['rt'][i] = d_h;
          hours_rt = d_h
        }
        totals_out['TotalHours_byDay']['rt'][7] += hours_rt;
      }
    }
    return totals_out;
  }


  overtimeBreakdown(vars, return_values) {
    // push show/dept to array with hours (that aren't the ot sel item)
    var byHours = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (var s_1 in vars.timesheet_totals_byShow) {
      for (var s_2 in vars.timesheet_totals_byShow[s_1]) {
        for (var i = 0; i < 7; i++) {
          if (!(vars.ot_sel[i][0] == s_1 && vars.ot_sel[i][1] == s_2)) {
            if (vars.timesheet_totals_byShow[s_1][s_2]['hours'][i] > 0.0) {
              byHours[i].push({ hours: vars.timesheet_totals_byShow[s_1][s_2]['hours'][i], cat_1: s_1, cat_2: s_2 });
            }
          }
        }
      }
    }

    // sort days' hour by show/dept hours (DESC)
    for (var i = 0; i < 7; i++) {
      byHours[i].sort(function (a, b) { return (a.hours < b.hours) ? 1 : ((b.hours < a.hours) ? -1 : 0); });
    }

    // prepend to the front the show/dept to array that is selected as the ot priority
    for (var s_1 in vars.timesheet_totals_byShow) {
      for (var s_2 in vars.timesheet_totals_byShow[s_1]) {
        for (var i = 0; i < 7; i++) {
          if (vars.ot_sel[i][0] == s_1 && vars.ot_sel[i][1] == s_2) {
            byHours[i].unshift({ hours: vars.timesheet_totals_byShow[s_1][s_2]['hours'][i], cat_1: s_1, cat_2: s_2 });
          }
        }
      }
    }

    var ot_assignment = { 'rt': [], 'ot': [], 'dt': [] };


    for (var i = 0; i < 7; i++) {
      if (vars.timesheet_totals['ot'][i] > 0.0) {
        var hours = vars.timesheet_totals['rt'][i];
        var hours_ot = vars.timesheet_totals['ot'][i];
        var hours_dt = vars.timesheet_totals['dt'][i];

        // go through the projects in order of priorty
        for (var x_1 in byHours[i]) {
          var hours_byShow = byHours[i][x_1]['hours'];

          if (vars.current_office == 0) { // California Rules

            if (hours_dt > 0.0) {
              ot_assignment['dt'].push({ day: i, hours: (hours_byShow > hours_dt) ? hours_dt : hours_byShow, cat_1: byHours[i][x_1]['cat_1'], cat_2: byHours[i][x_1]['cat_2'] });

              // after assignment then we need to adjust the hours
              var hours_byShow_tmp = hours_byShow;
              hours_byShow = (hours_byShow > hours_dt) ? hours_byShow - hours_dt : 0;
              hours_dt = (hours_byShow_tmp > hours_dt) ? 0 : hours_dt - hours_byShow_tmp;
            }
          }

          if (hours_ot > 0.0 && hours_byShow > 0.0) {
            ot_assignment['ot'].push({ day: i, hours: (hours_byShow > hours_ot) ? hours_ot : hours_byShow, cat_1: byHours[i][x_1]['cat_1'], cat_2: byHours[i][x_1]['cat_2'] });

            // after assignment then we need to adjust the hours
            var hours_byShow_tmp = hours_byShow;
            hours_byShow = (hours_byShow > hours_ot) ? hours_byShow - hours_ot : 0;
            hours_ot = (hours_byShow_tmp > hours_ot) ? 0 : hours_ot - hours_byShow_tmp;
          }
        }
      }
    }

    vars.ot_assignment = ot_assignment;
    //vars.show_ot_breakdown = false;

    if (return_values) {
      return vars.ot_assignment;
    }
  }

  calendarBackForth(cur_year_month, n) {
    var new_date = new Date(cur_year_month[0], cur_year_month[1] + n)
    return this.generateCalendar(new_date)
  }


  calendarLabel(d1, offset=0) {
    d1 = new Date(d1 + ' 00:00:00:00');
    var d2 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + 6 + offset);
    var today = this.date_yyyymmdd_dashed(new Date());


    var d1_t = this.date_yyyymmdd_dashed(d1);
    var d2_t = this.date_yyyymmdd_dashed(d2);

    // if the week is the current week then add (this week) text. 
    var this_week = (today >= d1_t && today <= d2_t) ? ' (this week)' : '';

    return this.mo_text[d1.getMonth()] + ' ' + d1.getDate() + ' - ' + this.mo_text[d2.getMonth()] + ' ' + d2.getDate() + this_week;
  }

  generateCalendar(in_date) {
    var today = new Date();
    var calendar = { week_of: '', weeks: [], month_label: '', week_forth: { label: '', week_of: '' }, week_back: { label: 'here', week_of: '2018-01-01' }, cur_year_month: [in_date.getFullYear(), in_date.getMonth()] };

    var day_of_week = new Date(in_date.getFullYear(), (in_date.getMonth()), 1).getDay();
    var month_len = new Date(in_date.getFullYear(), (in_date.getMonth() + 1), 0).getDate();
    var prev_month_len = new Date(in_date.getFullYear(), in_date.getMonth(), 0).getDate();

    calendar.month_label = this.mo_text_long[in_date.getMonth()] + ' ' + in_date.getFullYear();
    calendar.week_of = this.determineWeek(new Date(), 0);

    day_of_week = (day_of_week == 0) ? 6 : day_of_week - 1;

    var week = { cur_week: false, week_of: '', week_of_label: '', days: [{ cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }] };

    for (var i = 1; i <= month_len; i++) {

      // add date to week array
      week.days[day_of_week].date = i;
      week.days[day_of_week].cur_mo = true;

      // If the first of the month does not start on a Monday then include the days from the prior month. 
      if (week.days[0].date == 0 && day_of_week != 0) {
        var prev_mo_day = prev_month_len;
        for (var i_i = day_of_week - 1; i_i >= 0; i_i--) {
          week.days[i_i].date = prev_mo_day;

          // if start of week, create label and assign week_of
          if (i_i == 0) {
            var prev_month = new Date(in_date.getFullYear(), in_date.getMonth(), 0)
            week.week_of = this.date_yyyymmdd_dashed(new Date(prev_month.getFullYear(), prev_month.getMonth(), prev_mo_day));
            week.week_of_label = this.calendarLabel(week.week_of);
          }
          prev_mo_day--;
        }
      }

      // if start of week, create label and assign week_of
      if (day_of_week == 0) {
        var sunday = new Date(in_date.getFullYear(), in_date.getMonth(), i + 6)
        week.week_of = this.date_yyyymmdd_dashed(new Date(in_date.getFullYear(), in_date.getMonth(), i))
        week.week_of_label = this.mo_text[in_date.getMonth()] + ' ' + i + ' - ' + this.mo_text[sunday.getMonth()] + ' ' + sunday.getDate();
      }


      if (today.getDate() == i && today.getMonth() == in_date.getMonth() && today.getFullYear() == in_date.getFullYear()) {
        week.cur_week = true;
        week.week_of_label += ' (this week)'
        //calendar.week_label = week.week_of_label

        // setup initial back forth buttons for date
        calendar.week_back.week_of = this.determineWeek(new Date(), -7);
        calendar.week_back.label = this.calendarLabel(calendar.week_back.week_of);

        calendar.week_forth.week_of = this.determineWeek(new Date(), 7);
        calendar.week_forth.label = this.calendarLabel(calendar.week_forth.week_of);
      }

      // if end of month see if ends on a Sunday. If not, then fill in the rest of the week with the next months dates
      if (i == (month_len)) {
        var next_mo_day = 1;
        for (var i_i = day_of_week + 1; i_i <= 6; i_i++) {
          week.days[i_i].date = next_mo_day;
          next_mo_day++;
        }
        calendar.weeks.push(week)
      } else {
        // see if end of the week, if so then append week array to months.weeks and reset the week array and reent the day of week to zero. Otherwise just increase the day of week by 1;
        if (day_of_week == 6) {
          calendar.weeks.push(week)
          var week = { cur_week: false, week_of: '', week_of_label: '', days: [{ cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }, { cur_mo: false, date: 0 }] };
          day_of_week = 0;
        } else {
          day_of_week++;
        }
      }
    }
    return calendar
  }



  determineWeek(date_in, offset) {
    var day = date_in.getDay();
    var prevMonday;

    if (date_in.getDay() == 0) {
      //prevMonday = new Date().setDate(date_in.getDate() - 6);
      prevMonday = new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate() - 6 + offset)
    } else if (date_in.getDay() == 0) {
      //prevMonday = new Date().setDate(date_in.getDate() - day);
      prevMonday = new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate() - day + offset)
    } else {
      //prevMonday = new Date().setDate(date_in.getDate() - day + 1);
      prevMonday = new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate() - day + 1 + offset)
    }

    // Format previous monday to yyyy-mm-dd
    //var date = new Date(prevMonday);

    // apply offset
    // date = new Date(date.getFullYear(), date.getMonth(), date.getDate + offset);

    return this.date_yyyymmdd_dashed(prevMonday)
  }




  date_yyyymmdd_dashed(date_in) {

    var mm = date_in.getMonth() + 1; // getMonth() is zero-based
    var dd = date_in.getDate();

    return [date_in.getFullYear() + '-',
    (mm > 9 ? '' : '0') + mm + '-',
    (dd > 9 ? '' : '0') + dd
    ].join('');
  }

  date_server_to_client(date_in) {
    var date_out = new Date(date_in);
    return date_out
  }

  getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
  }


}


