import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ProductInventoryDetailsComponent } from './pages/product-inventory-details/product-inventory-details.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
  },
  {
    path: ':id',
    component: ProductInventoryDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
