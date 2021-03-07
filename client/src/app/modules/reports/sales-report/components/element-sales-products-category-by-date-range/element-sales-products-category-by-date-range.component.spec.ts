import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSalesProductsCategoryByDateRangeComponent } from './element-sales-products-category-by-date-range.component';

describe('ElementSalesProductsCategoryByDateRangeComponent', () => {
  let component: ElementSalesProductsCategoryByDateRangeComponent;
  let fixture: ComponentFixture<ElementSalesProductsCategoryByDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElementSalesProductsCategoryByDateRangeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSalesProductsCategoryByDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
