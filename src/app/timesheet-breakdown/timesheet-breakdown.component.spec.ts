import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetBreakdownComponent } from './timesheet-breakdown.component';

describe('TimesheetBreakdownComponent', () => {
  let component: TimesheetBreakdownComponent;
  let fixture: ComponentFixture<TimesheetBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
