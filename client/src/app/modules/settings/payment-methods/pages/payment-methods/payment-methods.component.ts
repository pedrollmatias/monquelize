import { Component, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/views.model';
import { DialogPaymentMethodDetailsComponent } from '../../components/dialog-payment-method-details/dialog-payment-method-details.component';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { MatPaginator } from '@angular/material/paginator';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.paymentMethodsDataSource.paginator = paginator;
  }

  paymentMethodsColumns: string[] = ['name', 'acceptChange'];
  paymentMethodsDataSource = new MatTableDataSource<IPaymentMethod>();

  paymentMethods: IPaymentMethod[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private paymentMethodApi: ApiPaymentMethodService,
    private dialog: MatDialog,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.paymentMethodApi.getPaymentMethods().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.paymentMethods = this.getPaymentMethods(res);
      this.setDataSource(this.paymentMethods);
    });
  }

  getPaymentMethods(res: IHttpResponse): IPaymentMethod[] {
    const paymentMethodsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(paymentMethodsByServer, 'name');
  }

  setDataSource(paymentMethods: IPaymentMethod[]): void {
    this.paymentMethodsDataSource = new MatTableDataSource(paymentMethods);
    this.paymentMethodsDataSource.paginator = this.paginator;
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.paymentMethods = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  openPaymentMethodDetailsDialog(associatedIds?: IAssociatedIds): void {
    const paymentMethodDetailsDialogRef = this.dialog.open(DialogPaymentMethodDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        paymentMethods: this.paymentMethods,
        associatedIds: associatedIds,
      },
    });

    paymentMethodDetailsDialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.resetData();
            return this.paymentMethodApi.getPaymentMethods();
          }
          return of(null);
        }),
        map((res) => (res ? { confirmed: true, res } : { confirmed: false }))
      )
      .subscribe(({ confirmed, res }: { confirmed: Boolean; res?: IHttpResponse }) => {
        if (confirmed) {
          this.databaseTimes = this.utils.setTimes(res);
          this.paymentMethods = this.getPaymentMethods(res);
          this.setDataSource(this.paymentMethods);
        }
      });
  }
}
