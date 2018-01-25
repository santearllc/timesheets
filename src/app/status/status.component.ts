import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {


  
    // temporary variables used during development
    week_labels = ['Jan 1 - Jan 7 (this week)',
    'Jan 8 - Jan 14',
    'Jan 15 - Jan 21',
    'Jan 22 - Jan 28',
    'Jan 29 - Feb 4'
  ]

  save_status = 'saved';
  users; 
  users_array;
  status_class;
  status_label;
  vars = Object();

  constructor(public serviceService: ServiceService) {
		// connection to database functions
  }

  ngOnInit() {
    this.users = this.serviceService.getUsers_db();    
    this.users_array = this.users_to_array(this.users);
    this.vars.lines = this.serviceService.getApprovalLines();
    this.workedOn(this.vars.lines);
    
    this.vars.total = [0,0,0,0,0];
    this.totalStatuses(this.users_array);

    this.vars.status_date = 'Dec 18 - Dec 24 (this week)';

    this.vars.filter = [true, true, true, true, true];
    this.vars.search_name = '';
    this.vars.search_project = '';

    


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

  }

  totalStatuses(lines){
    for(var i = 0; i < lines.length; i++){  
      var line = lines[i];
      
      this.vars.total[line.TimeSheetStatus] += 1;
    }
  }

  workedOn(lines){    
    for(var i = 0; i < lines.length; i++){  
      var line = lines[i];
      if(this.users[line.UserKey].Data.WorkedOn.indexOf(line.Cat_2_Title) == -1){
        this.users[line.UserKey].Data.WorkedOn.push(line.Cat_2_Title)
      }
    }
  }

  users_to_array(obj_in){
    var arr_out = Array();
    
    for(var i in obj_in) {
      arr_out.push(obj_in[i])
    }
    
    arr_out.sort(this.compare);
    return arr_out;
  }

  // temp function during dev
  weekSelected(week_i) {
    this.vars.status_date = this.week_labels[week_i];
    this.vars.showCal = false;
  }

  searchProject(WorkedOn){  
    for(var i = 0; i < WorkedOn.length; i++){
      if(WorkedOn[i].toLowerCase().indexOf(this.vars.search_project.toLowerCase()) != -1){
        return true; 
      }
    }
    return false;
  }

  compare(a,b) {
    if (a.FullName_r < b.FullName_r)
      return -1;
    if (a.FullName_r > b.FullName_r)
      return 1;
    return 0;
  }
  
  

}
