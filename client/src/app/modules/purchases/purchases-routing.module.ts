import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { PurchaseDetailsComponent } from './pages/purchase-details/purchase-details.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
  },
  {
    path: 'add',
    component: PurchaseDetailsComponent,
  },
  {
    path: 'edit/:id',
    component: PurchaseDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
