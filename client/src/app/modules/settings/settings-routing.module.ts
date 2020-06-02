import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then((mod) => mod.UsersModule),
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
