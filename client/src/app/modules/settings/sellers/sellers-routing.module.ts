import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellersComponent } from './pages/sellers/sellers.component';
import { SellerDetailsComponent } from './pages/seller-details/seller-details.component';

const routes: Routes = [
  { path: '', component: SellersComponent },
  { path: 'add', component: SellerDetailsComponent },
  { path: 'edit', component: SellerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersRoutingModule {}
