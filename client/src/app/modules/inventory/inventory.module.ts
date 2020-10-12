import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ProductInventoryDetailsComponent } from './pages/product-inventory-details/product-inventory-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogInventoryAdjustmentComponent } from './components/dialog-inventory-adjustment/dialog-inventory-adjustment.component';
import { DialogAddInventoryMovementComponent } from './components/dialog-add-inventory-movement/dialog-add-inventory-movement.component';

@NgModule({
  declarations: [InventoryComponent, ProductInventoryDetailsComponent, DialogInventoryAdjustmentComponent, DialogAddInventoryMovementComponent],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
})
export class InventoryModule {}
