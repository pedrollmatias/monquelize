import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellersRoutingModule } from './sellers-routing.module';
import { SellersComponent } from './pages/sellers/sellers.component';
import { SellerDetailsComponent } from './pages/seller-details/seller-details.component';


@NgModule({
  declarations: [SellersComponent, SellerDetailsComponent],
  imports: [
    CommonModule,
    SellersRoutingModule
  ]
})
export class SellersModule { }
