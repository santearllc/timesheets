import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  searchProject
  searchName
  status_date = "Dec 4 - Dec 11"

  constructor() { }

  ngOnInit() {
  }

}
