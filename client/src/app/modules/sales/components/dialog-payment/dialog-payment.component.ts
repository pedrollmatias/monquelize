import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';
import { IPaymentMethod, IOperationProduct, IUser, ISale } from 'src/app/shared/models/views.model';

declare interface IInitialRequests {
  paymentMethods: Observable<IHttpResponse>;
  users: Observable<IHttpResponse>;
}

declare interface IInitialResponse {
  paymentMethods: IHttpResponse;
  users: IHttpResponse;
}

@Component({
  selector: 'app-dialog-payment',
  templateUrl: './dialog-payment.component.html',
  styleUrls: ['./dialog-payment.component.scss'],
})
export class DialogPaymentComponent implements OnInit {
  showPageData = false;

  products: IOperationProduct[];

  paymentMethods: IPaymentMethod[];
  users: IUser[];

  seller: IUser;
  sellerFormControl = new FormControl();
  paymentMethod: IPaymentMethod;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogPaymentComponent>,
    private paymentMethodApi: ApiPaymentMethodService,
    private saleApi: ApiSaleService,
    private sharedComponents: SharedComponentsService,
    private userApi: ApiUserService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.products = [...this.data.products];
    const initialRequests: IInitialRequests = {
      paymentMethods: this.paymentMethodApi.getPaymentMethods(),
      users: this.userApi.getUsers(),
    };
    forkJoin(initialRequests).subscribe((res: IInitialResponse) => {
      const { paymentMethods: paymentMethodsRes, users: usersRes } = res;
      this.paymentMethods = this.getPaymentMethods(paymentMethodsRes);
      this.users = this.getUsers(usersRes);
      this.showPageData = true;
    });
  }

  closeDialog(confirmed: boolean = null): void {
    this.dialogRef.close(confirmed);
  }

  getUsers(res: IHttpResponse): IUser[] {
    const usersByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(usersByServer, 'username');
  }

  getPaymentMethods(res: IHttpResponse): IPaymentMethod[] {
    const paymentMethodsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(paymentMethodsByServer, 'name');
  }

  onPaymentMethodClick(paymentMethod: IPaymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  handleSellerSelection(seller: IUser): void {
    this.sellerFormControl.setValue(seller);
  }

  get showConfirmSaleButton() {
    return Boolean(this.paymentMethod);
  }

  formatSale(productsList: IOperationProduct[], paymentMethod: IPaymentMethod, seller: IUser): ISale {
    return {
      date: new Date(),
      timestamp: new Date().getTime(),
      products: productsList.map((product) => ({ ...product, price: product.salePrice })),
      paymentMethod: {
        ...paymentMethod,
        paymentMethodRef: paymentMethod._id,
      },
      seller,
    };
  }

  saveSale(): void {
    const sale: ISale = this.formatSale(this.products, this.paymentMethod, this.sellerFormControl.value);
    this.saleApi.createSale(sale).subscribe(() => {
      this.closeDialog(true);
      this.sharedComponents.openSnackbarSuccess('Sale confirmed successfully');
    });
  }
}
