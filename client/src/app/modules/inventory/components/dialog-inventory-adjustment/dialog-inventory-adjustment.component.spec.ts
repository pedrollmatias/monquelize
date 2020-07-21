import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInventoryAdjustmentComponent } from './dialog-inventory-adjustment.component';

describe('DialogInventoryAdjustmentComponent', () => {
  let component: DialogInventoryAdjustmentComponent;
  let fixture: ComponentFixture<DialogInventoryAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogInventoryAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
