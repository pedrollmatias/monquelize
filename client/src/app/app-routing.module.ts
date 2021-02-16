import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'sales',
    loadChildren: () => import('./modules/sales/sales.module').then((mod) => mod.SalesModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then((mod) => mod.ProductsModule),
  },
  {
    path: 'inventory',
    loadChildren: () => import('./modules/inventory/inventory.module').then((mod) => mod.InventoryModule),
  },
  {
    path: 'reports',
    loadChildren: () => import('./modules/reports/reports.module').then((mod) => mod.ReportsModule),
  },
  {
    path: 'purchases',
    loadChildren: () => import('./modules/purchases/purchases.module').then((mod) => mod.PurchasesModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then((mod) => mod.SettingsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
