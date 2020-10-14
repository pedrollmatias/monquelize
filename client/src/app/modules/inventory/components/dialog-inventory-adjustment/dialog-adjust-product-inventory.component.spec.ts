import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdjustProductInventoryComponent } from './dialog-adjust-product-inventory.component';

describe('DialogAdjustProductInventoryComponent', () => {
  let component: DialogAdjustProductInventoryComponent;
  let fixture: ComponentFixture<DialogAdjustProductInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAdjustProductInventoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdjustProductInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
