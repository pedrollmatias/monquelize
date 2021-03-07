import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReportRoutingModule } from './sales-report-routing.module';
import { SalesReportComponent } from './pages/sales-report/sales-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ElementSalesAmountTotalByDateRangeComponent } from './components/element-sales-amount-total-by-date-range/element-sales-amount-total-by-date-range.component';

@NgModule({
  declarations: [SalesReportComponent, ElementSalesAmountTotalByDateRangeComponent],
  imports: [CommonModule, SalesReportRoutingModule, SharedModule],
})
export class SalesReportModule {}
