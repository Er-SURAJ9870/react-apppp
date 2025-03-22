import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayAddEditComponent } from './holiday-add-edit.component';

describe('HolidayAddEditComponent', () => {
  let component: HolidayAddEditComponent;
  let fixture: ComponentFixture<HolidayAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
