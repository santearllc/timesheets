import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  searchProject;
  searchName;
  status_date = 'Dec 18 - Dec 24 (this week)';
  save_status = 'saved';
  users; 
  users_array;
  status_class;
  status_label;

  constructor(public serviceService: ServiceService) {
		// connection to database functions
  }

  ngOnInit() {
    this.users = this.serviceService.getUsers();
    this.users_array = this.users_to_array(this.users);
    

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


  users_to_array(obj_in){
    var arr_out = Array();
    
    for(var i in obj_in) {
      arr_out.push(obj_in[i])
    }
    return arr_out;
  }

  weekSelected(el){

  }
}
