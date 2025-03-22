import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAddEditComponent } from './leave-add-edit.component';

describe('LeaveAddEditComponent', () => {
  let component: LeaveAddEditComponent;
  let fixture: ComponentFixture<LeaveAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
