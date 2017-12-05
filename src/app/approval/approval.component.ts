import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { forEach } from '@angular/router/src/utils/collection';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  // variables
  approval_date = 'Nov 27 - Dec 3 (this week)';
  approvals = []
  users = {};
  lines: Object[];
  titles = {};
  timesheet = Object();
  timesheet_2 = Array();
  results;
  save_status;
  save_status_color;
  searchName = '';
  searchProject = '';
  user_focused: any = false;
  user_focused_el = false;
  save_timeout;

  constructor(public serviceService: ServiceService) {
    // connection to database functions
  }

  ngOnInit() {       
    this.users = this.serviceService.getUsers();
    this.lines = this.serviceService.getApprovalLines();

    let convertLinesToTimeSheet = this.convertLinesToTimeSheet(this.lines)
    this.timesheet = convertLinesToTimeSheet['timesheet'];
    this.titles = convertLinesToTimeSheet['titles'];
    this.generateTimeSheet(convertLinesToTimeSheet['timesheet']);
    this.sumTimeSheet();
  }

  saveTimeSheet() {
    this.save_status = "saving"
    this.save_status_color = "yellow"
    let loc_this = this;

    clearTimeout(this.save_timeout);

    this.save_timeout = setTimeout(function () {
      loc_this.save_status = "saved";
      loc_this.save_status_color = "green"
    }, 1500)
  }

  convertLinesToTimeSheet(lines) {
    let timesheet = {};
    let titles = {};

    for (var i = 0; i < lines.length; i++) {
      var element = this.lines[i];

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

      // add hours to timesheet object
      if (element['Cat_5'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Hours'] = element['Hours'];
      } else if (element['Cat_4'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']][element['Cat_4']]['Hours'] = element['Hours'];
      } else if (element['Cat_3'] != null) {
        timesheet[element['Cat_1']][element['Cat_2']][element['UserKey']][element['Cat_3']]['Hours'] = element['Hours'];
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
    return { timesheet: timesheet, titles: titles }
  }

  generateTimeSheet(timesheet) {
    let children = {}
    children[1] = [];
    children[2] = [];
    children[3] = [];
    children[4] = [];
    children[5] = [];

    // Reset User's Total Hours
    for (var user in this.users) {
      this.users[user]['Data']['TotalHours'] = 0;
    }
    this.timesheet_2 = Array();

    for (var prop_1 in timesheet) {
      if (prop_1 != 'Hours') {
        children[1] = [];  // rest children
        //children[1].push({ title: '__Title_1__', cat_key: prop_1, cat_level: 1, hours: timesheet[prop_1]['Hours'], children: children[2] })

        for (var prop_2 in timesheet[prop_1]) {
          if (prop_2 != 'Hours') {
            children[2] = [];  // reset children
            children[1].push({ title: '', cat_key: prop_2, hours: timesheet[prop_1][prop_2]['Hours'], children: children[2] });

            for (var prop_3 in timesheet[prop_1][prop_2]) {
              var sum_hours = [0, 0, 0, 0, 0, 0, 0];
              var ot = [false, false, false, false, false, false, false];

              if (prop_3 != 'Hours') {
                children[3] = [];  // reset children
                children[2].push({
                  title: this.users[prop_3].FullName,
                  cat_key: prop_3,
                  hours: timesheet[prop_1][prop_2][prop_3]['Hours'],
                  children: children[3],
                  sum_hours: sum_hours,
                  rejected: false,
                  rejected_by: false,
                  rejected_note: '',
                  rejected_hover: false,
                  approved: false,
                  approved_by: false,
                  approved_dated: false,
                  ot: ot,
                  showNote: false
                })

                for (var prop_4 in timesheet[prop_1][prop_2][prop_3]) {
                  if (prop_4 != 'Hours') {
                    children[4] = [];  // reset children
                    children[3].push({
                      title: '',
                      cat_key: prop_4, note: '',
                      hours: timesheet[prop_1][prop_2][prop_3][prop_4]['Hours'],
                      children: children[4],
                      showNote: false
                    });
                    var sumArrayHours = this.sumArrayHours(timesheet[prop_1][prop_2][prop_3][prop_4]['Hours'])
                    this.users[prop_3]['Data']['TotalHours'] += sumArrayHours;
                    for (var prop_5 in timesheet[prop_1][prop_2][prop_3][prop_4]) {
                      if (prop_5 != 'Hours') {
                        children[5] = [];
                        children[4].push({
                          title: '',
                          cat_key: prop_5, note: '',
                          hours: timesheet[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'],
                          children: children[5],
                          showNote: false
                        });
                        for (var prop_6 in timesheet[prop_1][prop_2][prop_3][prop_4][prop_5]) {
                          if (prop_6 != 'Hours') {
                            children[5].push({
                              title: '',
                              cat_key: prop_6, note: '',
                              hours: timesheet[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['Hours'],
                              children: [],
                              showNote: false
                            });
                            var sumArrayHours = this.sumArrayHours(timesheet[prop_1][prop_2][prop_3][prop_4][prop_5][prop_6]['Hours']);
                            this.users[prop_3]['Data']['TotalHours'] += sumArrayHours;
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
      this.timesheet_2.push({
        title: this.titles[prop_1].Title,
        cat_key: prop_1,
        children: children[1]
      });
    }
  }

  sumTimeSheet() {
    for (var i_1 = 0; i_1 < this.timesheet_2.length; i_1++) {
      var obj_1 = this.timesheet_2[i_1];
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
  }

  sumArrayHours(array_in) {
    var sumHours = 0;
    try {
      array_in.forEach(element => {
        sumHours += element;
      });
    } catch (err) { }
    return sumHours;
  }

  rowApproved(event, el) {
    var par_obj = $(event.target);
    this.user_focused_el = el;
    this.user_focused = false;

    $('.approval_breakdown').hide();  
    if (el['approved']) {
      $('#confirm_unapproval_popup').show();
    } else {
      this.saveTimeSheet();
      el['approved'] = true;
      el['approved_by'] = 'Your Name';
    }
  }

  rowRejected(event, el) {
    var par_obj = $(event.target);

    if (el['rejected']) {
      this.user_focused_el = false;
      el['rejected'] = false;
      el['rejected_by'] = false;
      this.user_focused = false;
      this.saveTimeSheet();
      $('.approval_breakdown').hide();
      
    } else {
      this.user_focused_el = el;
      el['rejected'] = true;
      el['rejected_by'] = 'Your Name';      
      $('#rejected_note_popup').show();
      $('#rejected_note_popup').find('.popup_title').html('Rejection Note');
      $('#rejected_note_popup').find('.popup_text').html('<textarea style="width:100%;resize:none;height:100px;">'
        + this.user_focused_el['rejected_note']
        + '</textarea>');
      var buttons = $('#rejected_note_popup').find('.popup_buttons button').toArray();
      this.saveTimeSheet();
    }
  }

  toggleBreakdown(event, UserKey) {
    var par_obj = $(event.target);
    var cur_state = par_obj.parent().parent().parent().parent().parent().find('.approval_breakdown').is(':visible');
    $('.approval_breakdown').hide();
    this.user_focused = false;
    if (!cur_state) {
      par_obj.parent().parent().parent().parent().parent().find('.approval_breakdown').show();
      this.user_focused = UserKey;
    }
  }


  saveRejectionNote(event) {
    var par_obj = $('#rejected_note_popup');
    var cur_text = $('#rejected_note_popup').find('.popup_text textarea').val().trim();
    this.user_focused_el['rejected_note'] = cur_text;
    this.saveTimeSheet();
    par_obj.fadeOut();
  }

  unapprovalConfirmed(event) {
    $('#confirm_unapproval_popup').fadeOut();
    this.user_focused_el['approved'] = false;
    this.user_focused_el['approved_by'] = false;    
    this.saveTimeSheet();
  }

  closePopup(event) {
    var par_obj = $(event.target).closest('.popup');
    par_obj.fadeOut();
  }

}



