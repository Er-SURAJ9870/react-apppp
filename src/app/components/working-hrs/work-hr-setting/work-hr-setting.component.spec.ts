import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHrSettingComponent } from './work-hr-setting.component';

describe('WorkHrSettingComponent', () => {
  let component: WorkHrSettingComponent;
  let fixture: ComponentFixture<WorkHrSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkHrSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkHrSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
