import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentMethodDetailsComponent } from './dialog-payment-method-details.component';

describe('DialogPaymentMethodDetailsComponent', () => {
  let component: DialogPaymentMethodDetailsComponent;
  let fixture: ComponentFixture<DialogPaymentMethodDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPaymentMethodDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaymentMethodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
