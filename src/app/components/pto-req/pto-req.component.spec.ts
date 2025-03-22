import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoReqComponent } from './pto-req.component';

describe('PtoReqComponent', () => {
  let component: PtoReqComponent;
  let fixture: ComponentFixture<PtoReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtoReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtoReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
