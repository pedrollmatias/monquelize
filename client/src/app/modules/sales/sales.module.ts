import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './pages/sales/sales.component';
import { SaleDetailsComponent } from './pages/sale-details/sale-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';
import { ElementDatabaseTimePosComponent } from './components/element-database-time-pos/element-database-time-pos.component';
import { DialogPaymentComponent } from './components/dialog-payment/dialog-payment.component';

@NgModule({
  declarations: [SalesComponent, SaleDetailsComponent, NewSaleComponent, ElementDatabaseTimePosComponent, DialogPaymentComponent],
  imports: [CommonModule, SalesRoutingModule, SharedModule],
})
export class SalesModule {}
