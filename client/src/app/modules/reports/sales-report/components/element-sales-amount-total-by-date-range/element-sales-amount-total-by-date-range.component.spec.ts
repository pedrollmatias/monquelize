import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSalesAmountTotalByDateRangeComponent } from './element-sales-amount-total-by-date-range.component';

describe('ElementSalesAmountTotalByDateRangeComponent', () => {
  let component: ElementSalesAmountTotalByDateRangeComponent;
  let fixture: ComponentFixture<ElementSalesAmountTotalByDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementSalesAmountTotalByDateRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSalesAmountTotalByDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
