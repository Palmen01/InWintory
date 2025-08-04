import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemThresholdTrackerComponent } from './item-threshold-tracker.component';

describe('ItemThresholdTrackerComponent', () => {
  let component: ItemThresholdTrackerComponent;
  let fixture: ComponentFixture<ItemThresholdTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemThresholdTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemThresholdTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
