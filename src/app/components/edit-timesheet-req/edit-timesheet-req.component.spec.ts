import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimesheetReqComponent } from './edit-timesheet-req.component';

describe('EditTimesheetReqComponent', () => {
  let component: EditTimesheetReqComponent;
  let fixture: ComponentFixture<EditTimesheetReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimesheetReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTimesheetReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
