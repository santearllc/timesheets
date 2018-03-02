import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service'; 



@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  vars = Object();

  constructor(public serviceService: ServiceService) {
    // connection to database functions    
  }

  ngOnInit() {

    this.vars.week_label = "Loading..."
    this.vars.export_files = []
    this.vars.export_allow = true

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

        this.load_payroll_periods()
        this.serviceService.checkLogin()
      }
    });




  }

  load_payroll_periods(){
    this.vars.payroll_periods = []

    this.serviceService.pay_periods().subscribe(res => {

      this.vars.payroll_periods = res;
      
      var week_of = this.determine_payroll_period(this.serviceService.date_yyyymmdd_dashed(new Date()))
     
      // create calendar for current week
      this.vars.calendar = this.serviceService.generateCalendar(new Date());
      this.vars.week_label = this.serviceService.calendarLabel(week_of, 7);

      this.vars.week_of = week_of;
      this.vars.lock_state = -1;
      this.get_pay_period_lock()
      this.get_exports()
    });

  }

  determine_payroll_period(date_in){
      for(var i = 0; i < this.vars.payroll_periods.length; i++){
        if(this.vars.payroll_periods[i] == date_in){
          return this.vars.payroll_periods[i]
        } else if(this.vars.payroll_periods[i] >= date_in){
          return this.vars.payroll_periods[i-1]
        }
      }
      return date_in
  }

  get_pay_period_lock(){
    clearTimeout(this.vars.timeout)

    this.serviceService.get_pay_period_lock(this.vars.week_of).subscribe(res => {
      this.vars.lock_state = res['status'];       
    });

    this.vars.timeout = setTimeout(res=>{
      this.get_pay_period_lock();
    }, 5000);
  }

  



  soft_lock(){
    clearTimeout(this.vars.timeout);

    if (this.vars.lock_state == 0){
      this.vars.lock_state = 1;
    } else {
      this.vars.lock_state = 0;
    }    

    var data = {'weekOf' : this.vars.week_of, 'status' : this.vars.lock_state};
      
    this.serviceService.pay_period_lock(data).subscribe(res => {
      this.get_pay_period_lock();
    });
  }

  hard_lock(){ 
    this.vars.showPopup = true;
  }

  confirm_hard_lock(){
    clearTimeout(this.vars.timeout);

    this.vars.lock_state = 2;
    this.vars.showPopup = false;
    var data = {'weekOf' : this.vars.week_of, 'status' : this.vars.lock_state};

    this.serviceService.pay_period_lock(data).subscribe(res => {
      this.get_pay_period_lock();
    });
  }

  export(){
    console.log('export');
    

    if(this.vars.export_allow){
      this.vars.export_allow = false;
      console.log('exporting');

      var week_of_next = this.serviceService.date_yyyymmdd_dashed(new Date(+new Date(this.vars.week_of) + 12096e5));

      this.serviceService.export_tss_data(this.vars.week_of, week_of_next).subscribe(res =>{
      })

      this.vars.export_timeout = setTimeout(res=>{
        this.vars.export_allow = true
      }, 5000)
    }
  }

  get_exports(){
    var week_of_next = this.serviceService.date_yyyymmdd_dashed(new Date(+new Date(this.vars.week_of) + 12096e5));

    this.serviceService.getExports(this.vars.week_of, week_of_next).subscribe(res => {
      this.vars.export_files = res;
    });

    setTimeout(res => {
      this.get_exports()
    },2500)
  }

  weekSelected(week_of_label, week_of) {
    clearTimeout(this.vars.timeout);

    this.vars.lock_state = -1;
    this.vars.showCal = false
    this.vars.week_of = this.determine_payroll_period(week_of)

    this.vars.week_label = this.serviceService.calendarLabel(this.vars.week_of, 7);
    
    this.get_pay_period_lock();    
  }
}
