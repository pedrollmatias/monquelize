import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddInventoryMovementComponent } from './dialog-add-inventory-movement.component';

describe('DialogAddInventoryMovementComponent', () => {
  let component: DialogAddInventoryMovementComponent;
  let fixture: ComponentFixture<DialogAddInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
