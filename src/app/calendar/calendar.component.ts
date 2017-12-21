import { Component, OnInit, Input } from '@angular/core';

import { EntryComponent } from '../entry/entry.component'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() entryComponent: EntryComponent;
  calendar_name = "This is a test";
  

  constructor() { }

  ngOnInit() {
    console.log('calendar loaded')
  }

  weekSelected(el){

  }

}
