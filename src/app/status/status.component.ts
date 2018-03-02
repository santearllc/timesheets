import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { forEach } from '@angular/router/src/utils/collection';


declare const gapi: any;
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  users_array;
  status_class;
  status_label;  
  vars = Object();

  constructor(public serviceService: ServiceService) {
		// connection to database functions
  }

  ngOnInit() {
    this.serviceService.delegator_selected = -1

    
    this.vars.total = [0,0,0,0,0];    
    this.vars.filter = [true, true, true, true, true];
    this.vars.search_name = '';
    this.vars.search_project = '';
    this.vars.show_loading = true;
    this.vars.showTitles = Object();
    this.vars.departmentTitles = Object();
    this.vars.titles = Object();

    this.status_class = [
      'pending_submission_icon',  // 0
      'submitted_icon',           // 1
      'rejected_icon',            // 2
      'partial_approved_icon',    // 3
      'approved_icon'             // 4
    ]

    this.status_label = [
      'Pending Submission',  // 0
      'Submitted',           // 1
      'Rejected',            // 2
      'Partial Approved',    // 3
      'Approved'             // 4
    ]

    // create calendar for current week
		this.vars.calendar = this.serviceService.generateCalendar(new Date());
		this.vars.week_label = this.serviceService.calendarLabel(this.vars.calendar.week_of);

    this.vars.week_of = this.vars.calendar.week_of;
    
    this.serviceService.validateLogin().subscribe(res => {			
			this.serviceService.googleInit();

			if (!res['valid']) {	
				console.log('not valid login... set cookie and bring user to login page')
				this.serviceService.show_signin = true
				this.vars.valid_login = false;
				this.vars.invalid_login_res = res['message']

				setTimeout(timeout => {
					this.serviceService.logOut();
				}, 5000)
			} else if (!this.serviceService.getCookie('logged_in')) {
				setTimeout(timeout => {
					this.serviceService.logOut();
				}, 500)
			} else {
        this.serviceService.access = res['access'];
				document.cookie = "session=" + res.session;
				document.cookie = "sub=" + res.sub;
				this.serviceService.valid_login = true;

				this.vars.user_name = res['firstName'] + ' ' + res['lastName'];
				if (res['firstName'].length == 0 && res['lastName'].length == 0) {
					this.vars.user_name = res['email'];
				}

				// load timesheet and associated shows, departments, and tasks for current week
        setTimeout(res => {
          this.loadWeek(this.vars.week_of)  
        }, 1000);    

				this.serviceService.checkLogin()				
			}
    });
  }

  loadWeek(week_of){
      this.serviceService.geStatuses_db(week_of).subscribe(res => {

      if(!res['access_granted']){
        this.serviceService.go('entry')
        return false;
      }

      this.vars.show_loading = false;
      this.vars.showTitles = res['shows'];
      this.vars.departmentTitles = res['departments'];
      this.vars.titles = res['titles'];

      this.users_array = this.users_to_array(res['users']);
      this.totalStatuses(this.users_array);
      
      clearTimeout(this.vars.loadWeek_timeout)

      this.vars.loadWeek_timeout = setTimeout(res=>{
        this.loadWeek(this.vars.week_of)  
      },5000);
    });
    
  }

  totalStatuses(lines){
    this.vars.total = [0,0,0,0,0];
    for(var i = 0; i < lines.length; i++){  
      var line = lines[i];
      
      this.vars.total[line.timeSheetStatus] += 1;
    }
  }


  users_to_array(obj_in){
    var arr_out = Array();    
    for(var i in obj_in) {
      obj_in[i]['shows_departments'] = ''

      for(var w = 0; w < obj_in[i]['worked'].length; w++){
        var obj = obj_in[i]['worked'][w];
        obj_in[i]['shows_departments'] += this.vars.titles[obj[0]+'_'+obj[1]]
      }
      arr_out.push(obj_in[i])
    }
    arr_out.sort(this.compare);    
    return arr_out;
  }


  weekSelected(week_of_label, week_of) {
    this.vars.show_loading = true
    this.vars.week_label = week_of_label;
    this.vars.week_of = week_of


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

    setTimeout(res => {
      this.loadWeek(this.vars.week_of)  
    }, 1000);    
  }

  searchProject(worked){  
    

  }



  prompt_load(user){
    // before loading time sheet for the selected user ask if that is the action in which they want to take. 

    this.vars.selected_user = user

    console.log(this.vars.selected_user)
    this.vars.showPopup = true;

  }


  submit(){
    console.log('submit time sheet')
    console.log(this.vars.selected_user)
  }

  unsubmit(){
    console.log('unsubmit time sheet')
    console.log(this.vars.selected_user)
  }


  edit(){
    console.log('edit time sheet')
    console.log(this.vars.selected_user)
    this.serviceService.delegator_selected = this.vars.selected_user["userKey"]

    this.serviceService.week_of = this.vars.week_of
    this.serviceService.go('entry')
  }



  compare(a,b) {
    if (a.fullName_r < b.fullName_r)
      return -1;
    if (a.fullName_r > b.fullName_r)
      return 1;
    return 0;
  }

}
