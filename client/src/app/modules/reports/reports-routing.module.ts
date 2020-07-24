import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
  },
  {
    path: 'sales-report',
    loadChildren: () => import('./sales-report/sales-report.module').then((mod) => mod.SalesReportModule),
  },
  {
    path: 'purchases-report',
    loadChildren: () => import('./purchases-report/purchases-report.module').then((mod) => mod.PurchasesReportModule),
  },
  {
    path: 'products-report',
    loadChildren: () => import('./products-report/products-report.module').then((mod) => mod.ProductsReportModule),
  },
  {
    path: 'inventory-report',
    loadChildren: () => import('./inventory-report/inventory-report.module').then((mod) => mod.InventoryReportModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
