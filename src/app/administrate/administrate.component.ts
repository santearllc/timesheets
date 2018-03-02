import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

declare const gapi: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-administrate',
  templateUrl: './administrate.component.html',
  styleUrls: ['./administrate.component.css']
})


export class AdministrateComponent {
  // store all variables, objects, arrays in this object
  vars = Object();
  

  constructor(public serviceService: ServiceService) {
    // connection to database functions
  }

  ngOnInit() {    

    this.vars.set_access = {}
    this.vars.set_access['approvals'] = []
    this.vars.set_access['status'] = []
    this.vars.set_access['export'] = []
    this.vars.set_access['admin'] = []



    this.vars.set_access['admin'].push({'userKey' : 0, 'fullName' : 'Tyler Cote'})


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

        // once person is has been authenticated then do next step... 
        this.getUsers();
        this.getShows();
        this.getDepartments();
        this.getAccess()
        // current year

        this.vars.calendar = this.serviceService.generateCalendar(new Date());
        this.vars.week_label = this.serviceService.calendarLabel(this.vars.calendar.week_of);

        this.vars.week_of = this.vars.calendar.week_of;


        this.vars.custom_week_year = new Date().getFullYear()

        /*this.serviceService.getCustomWeek(this.vars.custom_week_year).subscribe(res=>{
          console.log('get custom weeks')
          console.log(res)
          this.vars.custom_week_start = res
        })
        */
        this.serviceService.checkLogin()
        
      }
    });
    this.vars.custom_week_start = [];
  }

  getAccess(){
    this.serviceService.getAccess().subscribe(res => {
      console.log('This is access: ')
      console.log(res)
      this.vars.set_access = res
    });
  }

  getUsers(){
    this.serviceService.getUsers_db().subscribe(res => {
      this.vars.users = res['users'];
      console.log(this.vars.users)
    });
  }

  getShows(){
    this.serviceService.getShows_db().subscribe(res => {
      this.vars.shows = res;
      console.log(this.vars.shows)
    });
  }  

  getDepartments(){
    this.serviceService.getDepartments_db().subscribe(res =>{
      this.vars.departments = res;
      console.log(this.vars.departments)
    })
  }
  


  searchDelegates(phrase){
    console.log('searching delegates')
    var results = [];
    phrase = phrase.trim()
     
        
    if(phrase.length <= 0){
      return false
    }

    for(var i = 0; i < this.vars.users.length; i++){
      var incl = false;

      if(this.vars.users[i]['fullName'].toLowerCase().indexOf(phrase.toLowerCase()) != -1){
        incl = true; 
      }

      if(this.vars.users[i]['fullName_r'].toLowerCase().indexOf(phrase.toLowerCase()) != -1){
        incl = true; 
      }
      
      if(this.vars.users[i]['email'].toLowerCase().indexOf(phrase.toLowerCase()) != -1){
        incl = true; 
      }

      if(incl){
        results.push(this.vars.users[i])
      }
    }

    return results;
  }

  delegateSelected(userData){
    this.vars.delegates_search= userData['fullName'] + ' allows the following people to fill out his/her time sheet: ';
    this.vars.delegate_result = false
    this.vars.delegate_sel = userData
    this.vars.delegators = []
    
    this.serviceService.getDelegates(this.vars.delegate_sel['public_key']).subscribe(res => {      
      this.vars.delegators = res
    });
  }

  delegatorSelected(userData){
    this.vars.delegate_add_result = false;
    this.vars.delegates_add_search = '';
    this.vars.delegators.push(userData);
    var data = {};
    data['userKey'] = userData['public_key'];
    data['userKey_delegate'] = this.vars.delegate_sel['public_key'];
    
    this.serviceService.addDelegate(data).subscribe(res => {      
    });
  }  



  removeDelegator(userData, index){
    var data = {};
    data['userKey'] = userData['public_key'];
    data['userKey_delegate'] = this.vars.delegate_sel['public_key'];
    
    // remove from array
    this.vars.delegators.splice(index, 1);

    // remove from database
    this.serviceService.removeDelegate(data).subscribe(res => {
    });    
  }

  searchShows(phrase){    
    var results = [];
    phrase = phrase.trim()
   
    if(phrase.length <= 0){
      return false
    }

    for(var i = 0; i < this.vars.shows.length; i++){
      if(this.vars.shows[i]['cat_Title'].toLowerCase().indexOf(phrase.toLowerCase()) != -1){
        this.vars.shows[i]['type'] = 'show';
        this.vars.shows[i]['cat_1'] = 0;
        results.push(this.vars.shows[i])
      }
    }

    for(var i = 0; i < this.vars.departments.length; i++){
      if(this.vars.departments[i]['cat_Title'].toLowerCase().indexOf(phrase.toLowerCase()) != -1){        
        this.vars.departments[i]['type'] = 'department';
        this.vars.departments[i]['cat_1'] = 1;
        results.push(this.vars.departments[i])
      }
    }

    return results;
  }


  showSelected(showData){
    this.vars.approvers_search= showData['cat_Title'];
    this.vars.approvers_show_sel = showData
    this.vars.approver_result = false
    this.vars.approver_sel= showData
    this.vars.approvers = []
    var param = 'cat1='+this.vars.approvers_show_sel['cat_1']+'&cat2='+this.vars.approvers_show_sel['cat_key']
    
    this.serviceService.getApprovers(param).subscribe(res => {      
      this.vars.approvers = res
    });
  }

  approverSelected(userData){
    this.vars.approvers_add_result = false;
    this.vars.approvers_add_search = '';
    this.vars.approvers.push(userData);
    var data = {};
    data['userKey'] = userData['public_key'];
    data['cat1'] = this.vars.approvers_show_sel['cat_1'];
    data['cat2'] = this.vars.approvers_show_sel['cat_key'];

    this.serviceService.addApprover(data).subscribe(res => {      
    });
  }


  removeApprover(userData, index){
    var data = {};
    data['userKey'] = userData['public_key'];
    data['cat1'] = this.vars.approvers_show_sel['cat_1'];
    data['cat2'] = this.vars.approvers_show_sel['cat_key'];
    this.vars.showCal = false;

    // remove from array
    this.vars.approvers.splice(index, 1);

    // remove from database
    this.serviceService.removeApprover(data).subscribe(res => {
    });
  }

  


  accessSelected(userData, page){
    console.log(userData)
    this.vars.admin_page_result = false;
    this.vars.admin_page_search = '';
    this.vars.set_access[page].push(userData)
    var data = {};
    data['userKey'] = userData['public_key'];    
    data['page'] = page;    

    this.serviceService.addAccess(data).subscribe(res => {
      console.log(res)
    });
  }


  removeAccess(userData, index, page){
    var data = {};
    data['userKey'] = userData['public_key'];
    data['page'] = page

    // remove from array
    this.vars.set_access[page].splice(index, 1);

    // remove from database
    this.serviceService.removeAccess(data).subscribe(res => {
    });
  }

  backYear(){
    this.vars.custom_week_year -=1 
  }

  forthYear(){
    this.vars.custom_week_year +=1
  }

  daySelected(week,weekOf, day_selected, index){
    console.log('day selected')    
    var new_date = new Date(weekOf+' 00:00:00:00')
    new_date.setDate(new_date.getDate() + index);
    var new_date_yyyymmdd = this.serviceService.date_yyyymmdd_dashed(new_date)
    
    var data = {}
    data['weekOf'] = weekOf;
    data['newStart'] = new_date_yyyymmdd;

    this.serviceService.addCustomWeek(data).subscribe(res => {
      console.log(res)
    });
  }

}

