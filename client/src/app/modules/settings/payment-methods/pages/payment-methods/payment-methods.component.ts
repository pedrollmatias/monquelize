import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { of } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/payment-method.model';
import { DialogPaymentMethodDetailsComponent } from '../../components/dialog-payment-method-details/dialog-payment-method-details.component';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  paymentMethodsColumns: string[] = ['name', 'acceptChange'];
  paymentMethodsDataSource: MatTableDataSource<IPaymentMethod>;

  constructor(private paymentMethodApi: ApiPaymentMethodService, private dialog: MatDialog) {}

  paymentMethods: IPaymentMethod[];

  mongodbMongooseTime: number;

  ngOnInit(): void {
    this.resetData();
    this.paymentMethodApi.getPaymentMethods().subscribe((paymentMethodRes) => {
      console.log(paymentMethodRes);
      this.paymentMethods = <IPaymentMethod[]>paymentMethodRes.res;
      this.mongodbMongooseTime = paymentMethodRes.time;
      this.setDataSource(this.paymentMethods);
    });
  }

  setDataSource(paymentMethods: IPaymentMethod[]): void {
    this.paymentMethodsDataSource = new MatTableDataSource(paymentMethods);
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.paymentMethods = undefined;
  }

  refreshComponent(): void {
    this.ngOnInit();
  }

  openPaymentMethodDetailsDialog(paymentMethodId: string = null): void {
    const paymentMethodDetailsDialogRef = this.dialog.open(DialogPaymentMethodDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        paymentMethods: this.paymentMethods,
        paymentMethodId: paymentMethodId,
      },
    });

    paymentMethodDetailsDialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.resetData();
            return this.paymentMethodApi.getPaymentMethods();
          } else {
            const paymentMethodRes: IHttpRes = { res: this.paymentMethods, time: this.mongodbMongooseTime };
            return of(paymentMethodRes);
          }
        })
      )
      .subscribe((paymentMethodRes: IHttpRes) => {
        this.paymentMethods = <IPaymentMethod[]>paymentMethodRes.res;
        this.mongodbMongooseTime = paymentMethodRes.time;
        this.setDataSource(this.paymentMethods);
      });
  }
}
