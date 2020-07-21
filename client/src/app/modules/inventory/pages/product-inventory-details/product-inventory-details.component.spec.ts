import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryDetailsComponent } from './product-inventory-details.component';

describe('ProductInventoryDetailsComponent', () => {
  let component: ProductInventoryDetailsComponent;
  let fixture: ComponentFixture<ProductInventoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInventoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
