import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInOutReportComponent } from './check-in-out-report.component';

describe('CheckInOutReportComponent', () => {
  let component: CheckInOutReportComponent;
  let fixture: ComponentFixture<CheckInOutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInOutReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
