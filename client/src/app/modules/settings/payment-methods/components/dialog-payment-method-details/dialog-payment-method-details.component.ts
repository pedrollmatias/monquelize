import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/views.model';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';

declare interface IPaymentMethodDialog {
  paymentMethods: IPaymentMethod[];
  paymentMethodId: string;
}

@Component({
  selector: 'app-dialog-payment-method-details',
  templateUrl: './dialog-payment-method-details.component.html',
  styleUrls: ['./dialog-payment-method-details.component.scss'],
})
export class DialogPaymentMethodDetailsComponent implements OnInit {
  paymentMethods: IPaymentMethod[];
  paymentMethodId: string;
  paymentMethodForm: FormGroup;

  paymentMethod: IPaymentMethod;
  mongodbMongooseTime: number;

  dialogTitle: string;

  isNewPaymentMethod: boolean;

  showLoadingArea = false;
  showDoneButton = false;

  constructor(
    public dialogRef: MatDialogRef<DialogPaymentMethodDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPaymentMethodDialog,
    private fb: FormBuilder,
    private paymentMethodApi: ApiPaymentMethodService,
    private sharedComponents: SharedComponentsService
  ) {}

  ngOnInit(): void {
    // this.paymentMethods = this.data.paymentMethods;
    // this.paymentMethodId = this.data.paymentMethodId;
    // this.isNewPaymentMethod = this.paymentMethodId ? false : true;
    // if (!this.isNewPaymentMethod) {
    //   this.showLoadingArea = true;
    //   this.paymentMethodApi.getPaymentMethod(this.paymentMethodId).subscribe((paymentMethodRes) => {
    //     this.paymentMethod = paymentMethodRes.res;
    //     this.mongodbMongooseTime = paymentMethodRes.time;
    //     this.createPaymentMethodForm();
    //     this.initFormData(this.paymentMethod);
    //     this.dialogTitle = 'Edit payment method';
    //   });
    // } else {
    //   this.createPaymentMethodForm();
    //   this.dialogTitle = 'Add payment method';
    // }
  }

  // resetTimes(): void {
  //   this.mongodbMongooseTime = null;
  // }

  // closeDialog(confirmed: boolean = null): void {
  //   this.dialogRef.close({ confirmed: confirmed });
  // }

  // createPaymentMethodForm(): void {
  //   this.paymentMethodForm = this.fb.group({
  //     name: [null, Validators.required],
  //     acceptChange: [false, Validators.required],
  //   });
  // }

  // initFormData(paymentMethod: IPaymentMethod): void {
  //   this.paymentMethodForm.setValue({
  //     name: paymentMethod.name,
  //     acceptChange: paymentMethod.acceptChange || false,
  //   });
  // }

  // compareCategories(option: any, selection: any) {
  //   return option._id === selection._id;
  // }

  // savePaymentMethod(): void {
  //   if (this.paymentMethodForm.invalid) {
  //     this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //   } else {
  //     this.dialogRef.disableClose = true;
  //     this.showLoadingArea = true;
  //     const paymentMethod = this.paymentMethodForm.value;
  //     if (this.isNewPaymentMethod) {
  //       this.paymentMethodApi.createPaymentMethod(paymentMethod).subscribe((paymentMethodRes: IHttpRes) => {
  //         this.showDoneButton = true;
  //         this.mongodbMongooseTime = paymentMethodRes.time;
  //       });
  //     } else {
  //       this.paymentMethodApi
  //         .editPaymentMethod(this.paymentMethodId, paymentMethod)
  //         .subscribe((paymentMethodRes: IHttpRes) => {
  //           this.showDoneButton = true;
  //           this.mongodbMongooseTime = paymentMethodRes.time;
  //         });
  //     }
  //   }
  // }

  // removeCategroy(): void {
  //   const message = 'This unit paymentMethod be removed. Are you sure you want to perform this action?';
  //   const dialogRef = this.sharedComponents.openDialogConfirmation(
  //     'warning',
  //     'warn',
  //     'Attention',
  //     message,
  //     'Remove paymentMethod'
  //   );

  //   dialogRef.beforeClosed().subscribe((confirmed) => {
  //     if (confirmed) {
  //       this.dialogRef.disableClose = true;
  //       this.showLoadingArea = true;
  //       const mongodbMongooseTimeBkp = this.mongodbMongooseTime;
  //       this.resetTimes();
  //       this.paymentMethodApi
  //         .removePaymentMethod(this.paymentMethodId)
  //         .pipe(
  //           catchError((err) => {
  //             this.showLoadingArea = true;
  //             this.mongodbMongooseTime = mongodbMongooseTimeBkp;
  //             this.dialogRef.disableClose = false;
  //             return throwError(err);
  //           })
  //         )
  //         .subscribe((paymentMethodRes: IHttpRes) => {
  //           this.showDoneButton = true;
  //           this.mongodbMongooseTime = paymentMethodRes.time;
  //         });
  //     }
  //   });
  // }
}
