import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { DialogPaymentMethodDetailsComponent } from './components/dialog-payment-method-details/dialog-payment-method-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PaymentMethodsComponent, DialogPaymentMethodDetailsComponent],
  imports: [CommonModule, PaymentMethodsRoutingModule, SharedModule],
})
export class PaymentMethodsModule {}
