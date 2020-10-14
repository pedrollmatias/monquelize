import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ProductInventoryDetailsComponent } from './pages/product-inventory-details/product-inventory-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogAddInventoryMovementComponent } from './components/dialog-add-inventory-movement/dialog-add-inventory-movement.component';
import { DialogAdjustProductInventoryComponent } from './components/dialog-inventory-adjustment/dialog-adjust-product-inventory.component';

@NgModule({
  declarations: [
    InventoryComponent,
    ProductInventoryDetailsComponent,
    DialogAdjustProductInventoryComponent,
    DialogAddInventoryMovementComponent,
  ],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
})
export class InventoryModule {}
