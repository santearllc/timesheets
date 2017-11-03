import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryRowComponent } from './entry-row.component';

describe('EntryRowComponent', () => {
  let component: EntryRowComponent;
  let fixture: ComponentFixture<EntryRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
