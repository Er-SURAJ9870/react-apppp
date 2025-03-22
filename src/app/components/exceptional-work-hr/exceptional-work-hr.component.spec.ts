import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionalWorkHrComponent } from './exceptional-work-hr.component';

describe('ExceptionalWorkHrComponent', () => {
  let component: ExceptionalWorkHrComponent;
  let fixture: ComponentFixture<ExceptionalWorkHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionalWorkHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionalWorkHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
