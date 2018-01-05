import { Component, OnInit, Pipe } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { TimesheetBreakdownComponent } from '../timesheet-breakdown/timesheet-breakdown.component';

import { forEach } from '@angular/router/src/utils/collection';

// Jquery import
//declare var jquery: any;
//declare var $: any;

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  // store all variables, objects, arrays in this object
  vars = Object();

  // temporary variables used during development
  week_labels = ['Jan 1 - Jan 7 (this week)',
    'Jan 8 - Jan 14',
    'Jan 15 - Jan 21',
    'Jan 22 - Jan 28',
    'Jan 29 - Feb 4'
  ]

  constructor(public serviceService: ServiceService) {
    // connection to database functions
  }

  ngOnInit() {

    // set some variables
    this.vars.approval_date = 'Jan 1 - Jan 7 (this week)';
    this.vars.save_status;
    this.vars.save_status_color;
    this.vars.search_name = '';
    this.vars.search_project = '';
    this.vars.user_focused = false;
    this.vars.user_focused_el = false;
    this.vars.days_label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    this.vars.days = [0, 1, 2, 3, 4, 5, 6]; // Order of days    
    this.vars.day_name_full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // get data from database
    this.vars.users = this.serviceService.getUsers();
    this.vars.lines = this.serviceService.getApprovalLines();

    // convert rows from database into object
    var converted = this.convertLinesToObject(this.vars.lines)
    var converted_studio = this.convertLinesToObject_studio(this.vars.lines);

    // set titles object 
    this.vars.titles = converted['titles'];
    this.vars.titles_studio = converted_studio['titles'];

    this.vars.timesheet = Array();
    this.vars.timesheet_by_user = Object();

    this.vars.save_timeout;

    // Reset User's Total Hours
    for (var user in this.vars.users) {
      this.vars.users[user]['Data']['TotalHours'] = 0;
      this.vars.users[user]['Data']['TotalHours_byDay']['t'] = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    // generate timesheet structure from timesheet obj
    this.vars.timesheet = this.generateApprovalLayoutObject(converted['timesheet'], this.vars.titles, true);


    // generate timesheet_studio structure from timesheet obj
    this.vars.timesheet_studio = this.generateApprovalLayoutObject(converted_studio['timesheet'], this.vars.titles_studio, false);


    // generate timesheet breakdown for every user
    for (var x in converted['timesheet_by_user']) {
      this.vars.timesheet_by_user[x] = this.serviceService.generateTimesheetByUser(converted['timesheet_by_user'][x], this.vars.titles, null)

      var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(this.vars.timesheet_by_user[x], this.vars.users[x].Data.TotalHours_byDay, this.vars.users[x].OfficeKey);
      this.vars.users[x].Data.timesheet_totals_byShow = totalsOvertimeBreakdown['TotalHours_byShow'];
      
      var tmp_vars = {
        timesheet_totals_byShow: this.vars.users[x].Data.timesheet_totals_byShow,
        timesheet_totals: this.vars.users[x].Data.TotalHours_byDay,
        ot_sel: this.vars.users[x].ot_sel,
        current_office: this.vars.users[x].OfficeKey,
        show_ot_breakdown: false
      }

      this.vars.users[x].Data.ot_assignment = this.serviceService.overtimeBreakdown(tmp_vars, true);      
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
        if (!timesheet.hasOwnProperty(element['Cat_1']) && element['Cat_1'] != null) {
          timesheet[element['Cat_1']] = {};
          titles[element['Cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']].hasOwnProperty(element['Cat_2']) && element['Cat_2'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']] = {};
          titles[element['Cat_1']][element['Cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']].hasOwnProperty(element['UserKey']) && element['UserKey'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']] = {};

        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']].hasOwnProperty(element['Cat_3']) && element['Cat_3'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']] = {};
          titles[element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']].hasOwnProperty(element['Cat_4']) && element['Cat_4'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']] = {};
          titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']].hasOwnProperty(element['Cat_5']) && element['Cat_5'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']][element['Cat_5']] = {};
          titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']] = {};
        }
      } catch (err) { }





      // Timesheet by user
      try {
        if (!timesheet_by_user.hasOwnProperty(element['UserKey']) && element['UserKey'] != null) {
          timesheet_by_user[element['UserKey']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['UserKey']].hasOwnProperty(element['Cat_1']) && element['Cat_1'] != null) {
          timesheet_by_user[element['UserKey']][element['Cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['UserKey']][element['Cat_1']].hasOwnProperty(element['Cat_2']) && element['Cat_2'] != null) {
          timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']].hasOwnProperty(element['Cat_3']) && element['Cat_3'] != null) {
          timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']].hasOwnProperty(element['Cat_4']) && element['Cat_4'] != null) {
          timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']].hasOwnProperty(element['Cat_5']) && element['Cat_5'] != null) {
          timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']] = {};
        }
      } catch (err) { }

      // add hours to timesheet object
      if (element['Cat_5'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Hours'] = element['Hours'];
      } else if (element['Cat_4'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']]['Hours'] = element['Hours'];
      } else if (element['Cat_3'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']]['Hours'] = element['Hours'];
      }

      // add hours to timesheet object (by user)
      if (element['Cat_5'] != null) {
        timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Hours'] = element['Hours'];
      } else if (element['Cat_4'] != null) {
        timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']]['Hours'] = element['Hours'];
      } else if (element['Cat_3'] != null) {
        timesheet_by_user[element['UserKey']][element['Cat_1']][element['Cat_2']][element['Cat_3']]['Hours'] = element['Hours'];
      }

      // Adds titles to title JSON
      try {
        titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Title'] = element['Cat_5_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']]['Title'] = element['Cat_4_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']][element['Cat_2']][element['Cat_3']]['Title'] = element['Cat_3_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']][element['Cat_2']]['Title'] = element['Cat_2_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']]['Title'] = element['Cat_1_Title'];
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
        if (!timesheet.hasOwnProperty(element['Cat_1']) && element['Cat_1'] != null) {
          timesheet[element['Cat_1']] = {};
          titles[element['Cat_1']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']].hasOwnProperty(element['Cat_2']) && element['Cat_2'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']] = {};
          titles[element['Cat_1']][element['Cat_2']] = {};
        }
      } catch (err) { }

      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']].hasOwnProperty(element['Cat_3']) && element['Cat_3'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
          titles[element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
        }
      } catch (err) { }


      try {
        if (!timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']].hasOwnProperty(element['UserKey']) && element['UserKey'] != null) {
          timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['UserKey']] = {};
          titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['UserKey']] = {};
        }
      } catch (err) { }

      // add hours to timesheet object
      if (element['Cat_3'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['UserKey']]['Hours'] = element['Hours'];
      }

      // Adds titles to title JSON
      try {
        titles[element['Cat_1']][element['Cat_2']][element['Cat_3']]['Title'] = element['Cat_3_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']][element['Cat_2']]['Title'] = element['Cat_2_Title'];
      } catch (err) { }

      try {
        titles[element['Cat_1']]['Title'] = element['Cat_1_Title'];
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
      if (prop_1 != 'Hours') {
        children[1] = [];  // rest children
        //children[1].push({ title: '__Title_1__', cat_key: prop_1, cat_level: 1, hours: timesheet[prop_1]['Hours'], children: children[2] })

        for (var prop_2 in timesheet_in[prop_1]) {
          if (prop_2 != 'Hours') {
            children[2] = [];  // reset children
            children[1].push({ title: '', cat_key: prop_2, hours: timesheet_in[prop_1][prop_2]['Hours'], children: children[2] });

            for (var prop_3 in timesheet_in[prop_1][prop_2]) {
              var sum_hours = [0, 0, 0, 0, 0, 0, 0];
              var ot = [false, false, false, false, false, false, false];
              if (prop_3 != 'Hours') {
                children[3] = [];  // reset children
                children[2].push({
                  title: '',
                  cat_key: prop_3,
                  hours: timesheet_in[prop_1][prop_2][prop_3]['Hours'],
                  children: children[3],
                  sum_hours: sum_hours,
                  rejected: false,
                  rejected_by: false,
                  rejected_note: '',
                  rejected_note_department: '',
                  rejected_hover: false,
                  approved: false,
                  approved_by: false,
                  approved_dated: false,
                  ot: ot,
                  showNote: false
                })

                if (sum_user_hours) {
                  this.vars.users[prop_3] = this.sumArrayHours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3]['Hours']);
                }

                for (var prop_4 in timesheet_in[prop_1][prop_2][prop_3]) {
                  if (prop_4 != 'Hours') {
                    children[4] = [];  // reset children
                    children[3].push({
                      title: '',
                      cat_key: prop_4, note: '',
                      hours: timesheet_in[prop_1][prop_2][prop_3][prop_4]['Hours'],
                      children: children[4],
                      showNote: false,
                      ot: ot,
                      rejected: false,
                      rejected_by: false,
                      rejected_note: '',
                      rejected_note_department: '',
                      rejected_hover: false,
                      approved: false,
                      approved_by: false,
                      approved_dated: false
                    });

                    if (sum_user_hours) {
                      this.vars.users[prop_3] = this.sumArrayHours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4]['Hours']);
                    }
                    for (var prop_5 in timesheet_in[prop_1][prop_2][prop_3][prop_4]) {
                      if (prop_5 != 'Hours') {
                        children[5] = [];
                        children[4].push({
                          title: '',
                          cat_key: prop_5, note: '',
                          hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'],
                          children: children[5],
                          showNote: false,
                          ot: ot
                        });

                        if (sum_user_hours) {
                          this.vars.users[prop_3] = this.sumArrayHours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours']);
                        }
                        for (var prop_6 in timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]) {
                          if (prop_6 != 'Hours') {
                            children[5].push({
                              title: '',
                              cat_key: prop_6, note: '',
                              hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['Hours'],
                              children: [],
                              showNote: false,
                              ot: ot
                            });
                            if (sum_user_hours) {
                              this.vars.users[prop_3] = this.sumArrayHours(this.vars.users[prop_3], timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['Hours']);
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
        title: titles_in[prop_1].Title,
        cat_key: prop_1,
        children: children[1]
      });
    }
    return timesheet_out;
  }

  // sums hours in array that is passed into it
  sumArrayHours(user_data_in, array_in) {
    var user_data_out = user_data_in;

    try {
      for (var i = 0; i < array_in.length; i++) {
        user_data_out['Data']['TotalHours'] += array_in[i];
        user_data_out['Data']['TotalHours_byDay']['t'][i] += array_in[i];  // untouched hours
        user_data_out['Data']['TotalHours_byDay']['rt'][i] += array_in[i];
        user_data_out['Data']['TotalHours_byDay']['rt'][7] += array_in[i];
      }
    } catch (err) { }

    var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(false, user_data_out['Data'], user_data_out['OfficeKey']);
    user_data_out['Data'].timesheet_totals_byShow = totalsOvertimeBreakdown['TotalHours_byShow'];
    
    return user_data_out
  }

  // approves selected row item 
  rowApproved(event, el) {
    this.vars.user_focused_el = el;
    this.vars.user_focused = false;

    this.hideBreakdowns();

    if (el['approved']) {
      this.vars.showPopup_unapproval = true;
    } else {
      this.save();
      el['approved'] = true;
      el['approved_by'] = 'Your Name';
    }
  }

  hideBreakdowns() {
    this.vars.user_focused = false;
    this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'breakdown_show', false)
    this.vars.timesheet_studio = this.serviceService.hideShowDivs(this.vars.timesheet_studio, 'breakdown_show', false)
  }

  // rejects selected row item
  rowRejectedConfirm(el) {
    if (!el.rejected) {
      this.vars.showPopup_reject_text_artist = false;
      this.vars.showPopup_reject_text_department = false;
      this.vars.user_focused_el = el;
      this.vars.showPopup_reject = true;
    }
  }

  // rejects selected row item
  rowRejected() {
    // Set all rows for this user to rejected
    var timesheet_array = [this.vars.timesheet, this.vars.timesheet_studio];

    for (var i = 0; i < timesheet_array.length; i++) {
      for (var x_1 in timesheet_array[i]) {
        for (var x_2 in timesheet_array[i][x_1]['children']) {
          for (var x_3 in timesheet_array[i][x_1]['children'][x_2]['children']) {
            try {
              if (timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['cat_key'] == this.vars.user_focused_el['cat_key']) {
                timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['rejected'] = true;
                timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['approved'] = false;
                timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['approved_by'] = '';
              }
            } catch (err) { }
            for (var x_4 in timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['children']) {
              try {
                if (timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['children'][x_4]['cat_key'] == this.vars.user_focused_el['cat_key']) {
                  timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['children'][x_4]['rejected'] = true;
                  timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['children'][x_4]['approved'] = false;
                  timesheet_array[i][x_1]['children'][x_2]['children'][x_3]['children'][x_4]['approved_by'] = '';
                }
              } catch (err) { }
            }
          }
        }
      }
    }

    var el = this.vars.user_focused_el;
    el['rejected'] = true;
    el['rejected_by'] = 'Your Name';

    if (this.vars.showPopup_reject_text_artist != false) {
      this.vars.user_focused_el['rejected_note'] = this.vars.showPopup_reject_text_artist.trim();
    }

    if (this.vars.showPopup_reject_text_department != false) {
      this.vars.user_focused_el['rejected_note_department'] = this.vars.showPopup_reject_text_department.trim();
    }

    this.vars.showPopup_reject = false;
    this.save();
  }

  // toggle the timesheet view for the selected user
  toggleBreakdown(event, UserKey, el) {
    var cur_state = el.breakdown_show;
    this.hideBreakdowns();

    if (cur_state) {
      el.breakdown_show = false;
      this.vars.user_focused = false;
    } else {
      el.breakdown_show = true;
      this.vars.user_focused = UserKey;
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
    this.vars.showPopup_unapproval = false;
    this.vars.user_focused_el['approved'] = false;
    this.vars.user_focused_el['approved_by'] = false;
    this.save();
  }

  closePopup() {
    this.vars.showPopup_unapproval = false;
  }


  // temp function during dev
  weekSelected(week_i) {
    this.vars.approval_date = this.week_labels[week_i];
    this.vars.showCal = false;
  }


  sumArray(in_array){
    var total = 0;
    in_array[7] = 0;

    for(var i_i=0;i_i < 7; i_i++){
      total += in_array[i_i];
      in_array[7] += in_array[i_i];
    }

    return total;
  }

  hasOT(array_in, cat_1, cat_2, day){    
    for(var i =0; i < array_in.length; i++){

      if(array_in[i].day == day && array_in[i].cat_1 == cat_1 && array_in[i].cat_2 == cat_2) {
        
        return array_in[i].hours;
      }
    }
    return false
  } 
}