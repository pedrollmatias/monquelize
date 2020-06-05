import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './pages/sales/sales.component';
import { SaleDetailsComponent } from './pages/sale-details/sale-details.component';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
  },
  {
    path: 'add-pos',
    component: NewSaleComponent,
  },
  {
    path: 'add',
    component: SaleDetailsComponent,
  },
  {
    path: 'edit/:id',
    component: SaleDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
