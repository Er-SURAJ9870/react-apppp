import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAddEditComponent } from './attendance-add-edit.component';

describe('AttendanceAddEditComponent', () => {
  let component: AttendanceAddEditComponent;
  let fixture: ComponentFixture<AttendanceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
