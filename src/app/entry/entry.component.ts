import { Component } from '@angular/core';



@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent {
 	username = "Tyler Cote";
	
	timesheet_date = "Oct 2 - Oct 9 (this week)";
	 
	category_1 = [0,1];
 	categories = ['Projects', 'Departments'];

	// Projects Array
	projects = [4565,4545,4444];
	project_titles = {4565 : 'Project A', 4545 : 'Project B',4444: 'Project C'};

	departments = [4565,4545,4444];
	department_titles = {4565 : 'Accounting', 4545 : 'Production',4444: 'HR'};


 	timesheet = {
 		0: {  //This will be project
 			5446 : {  // This will be a project key
 				1 : {  // This is a cat 3 key; if not asset or shot, then end here, else continue nesting
					1 : [0,0,0,0,0,0,0]
 				}
 			}
 		}, 
 		1: {  //This will be department			
 			1 : 'done'
 		}
 	};
}



	
