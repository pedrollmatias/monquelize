import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ProductInventoryDetailsComponent } from './pages/product-inventory-details/product-inventory-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogInventoryAdjustmentComponent } from './components/dialog-inventory-adjustment/dialog-inventory-adjustment.component';

@NgModule({
  declarations: [InventoryComponent, ProductInventoryDetailsComponent, DialogInventoryAdjustmentComponent],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
})
export class InventoryModule {}
