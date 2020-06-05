import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './pages/sales/sales.component';
import { SaleDetailsComponent } from './pages/sale-details/sale-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';

@NgModule({
  declarations: [SalesComponent, SaleDetailsComponent, NewSaleComponent],
  imports: [CommonModule, SalesRoutingModule, SharedModule],
})
export class SalesModule {}
