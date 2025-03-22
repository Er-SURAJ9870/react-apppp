import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionalWorkHrAddEditComponent } from './exceptional-work-hr-add-edit.component';

describe('ExceptionalWorkHrAddEditComponent', () => {
  let component: ExceptionalWorkHrAddEditComponent;
  let fixture: ComponentFixture<ExceptionalWorkHrAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionalWorkHrAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionalWorkHrAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
