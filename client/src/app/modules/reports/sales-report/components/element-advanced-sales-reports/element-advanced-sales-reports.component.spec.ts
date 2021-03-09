import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementAdvancedSalesReportsComponent } from './element-advanced-sales-reports.component';

describe('ElementAdvancedSalesReportsComponent', () => {
  let component: ElementAdvancedSalesReportsComponent;
  let fixture: ComponentFixture<ElementAdvancedSalesReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementAdvancedSalesReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementAdvancedSalesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
