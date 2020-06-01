import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { DialogPaymentMethodDetailsComponent } from './components/dialog-payment-method-details/dialog-payment-method-details.component';

@NgModule({
  declarations: [DialogPaymentMethodDetailsComponent],
  imports: [CommonModule, PaymentMethodsRoutingModule],
})
export class PaymentMethodsModule {}
