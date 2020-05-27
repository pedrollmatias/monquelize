import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { PurchaseDetailsComponent } from './pages/purchase-details/purchase-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PurchasesComponent, PurchaseDetailsComponent],
  imports: [CommonModule, PurchasesRoutingModule, SharedModule],
})
export class PurchasesModule {}
