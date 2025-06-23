import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTrackerComponent } from './cash-tracker.component';

describe('CashTrackerComponent', () => {
  let component: CashTrackerComponent;
  let fixture: ComponentFixture<CashTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
