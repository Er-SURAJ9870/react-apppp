import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInOutTableComponent } from './check-in-out-table.component';

describe('CheckInOutTableComponent', () => {
  let component: CheckInOutTableComponent;
  let fixture: ComponentFixture<CheckInOutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInOutTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInOutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
