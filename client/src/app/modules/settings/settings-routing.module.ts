import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
  {
    path: 'sellers',
    loadChildren: () => import('./sellers/sellers.module').then((mod) => mod.SellersModule),
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then((mod) => mod.CategoriesModule),
  },
  {
    path: 'units',
    loadChildren: () => import('./units/units.module').then((mod) => mod.UnitsModule),
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then((mod) => mod.PaymentMethodsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
