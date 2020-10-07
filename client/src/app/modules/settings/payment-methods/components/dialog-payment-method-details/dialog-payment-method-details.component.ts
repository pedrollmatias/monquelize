import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/views.model';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';

declare interface IPaymentMethodDialog {
  paymentMethods: IPaymentMethod[];
  associatedIds?: IAssociatedIds;
}

@Component({
  selector: 'app-dialog-payment-method-details',
  templateUrl: './dialog-payment-method-details.component.html',
  styleUrls: ['./dialog-payment-method-details.component.scss'],
})
export class DialogPaymentMethodDetailsComponent implements OnInit {
  paymentMethods: IPaymentMethod[];
  paymentMethod: IPaymentMethod;

  associatedIds: IAssociatedIds;

  paymentMethodForm: FormGroup;

  databaseTimes: IDatabaseTimes;

  dialogTitle: string;

  isNewPaymentMethod: boolean;

  endpointPaths: IPaths;

  showLoadingArea = false;
  showDoneButton = false;
  showForm = false;

  constructor(
    private paymentMethodApi: ApiPaymentMethodService,
    @Inject(MAT_DIALOG_DATA) public data: IPaymentMethodDialog,
    public dialogRef: MatDialogRef<DialogPaymentMethodDetailsComponent>,
    private fb: FormBuilder,
    private sharedComponents: SharedComponentsService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.paymentMethods = this.data.paymentMethods;
    this.associatedIds = this.data.associatedIds;
    this.isNewPaymentMethod = this.associatedIds ? false : true;
    if (!this.isNewPaymentMethod) {
      this.dialogTitle = 'Edit payment method';
      this.showLoadingArea = true;
      this.endpointPaths = this.getEndpointPaths(this.associatedIds);
      this.paymentMethodApi.getPaymentMethod(this.endpointPaths).subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        this.paymentMethod = { ...res?.mongodbMongoose?.res, associatedIds: this.associatedIds };
        this.createPaymentMethodForm();
        this.initFormData(this.paymentMethod);
        this.showForm = true;
      });
    } else {
      this.dialogTitle = 'Add payment method';
      this.createPaymentMethodForm();
      this.showForm = true;
    }
  }

  getEndpointPaths(associatedIds: IAssociatedIds): IPaths {
    return {
      mongodbMongoose: `/payment-methods/${associatedIds.mongodbMongooseId}`,
      postgresSequelize: `/payment-methods/${associatedIds.postgresSequelizeId}`,
    };
  }

  closeDialog(confirmed: boolean = null): void {
    this.dialogRef.close({ confirmed: confirmed });
  }

  createPaymentMethodForm(): void {
    this.paymentMethodForm = this.fb.group({
      name: [null, Validators.required],
      acceptChange: [false, Validators.required],
    });
  }

  initFormData(paymentMethod: IPaymentMethod): void {
    this.paymentMethodForm.patchValue(paymentMethod);
  }

  savePaymentMethod(): void {
    if (this.paymentMethodForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      this.databaseTimes = this.utils.resetTimes();
      this.showForm = false;
      const paymentMethod = this.paymentMethodForm.value;
      if (this.isNewPaymentMethod) {
        this.paymentMethodApi.createPaymentMethod(paymentMethod).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      } else {
        this.paymentMethodApi.editPaymentMethod(this.endpointPaths, paymentMethod).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      }
    }
  }

  removePaymentMethod(): void {
    const message = 'This payment method will be removed. Are you sure you want to perform this action?';
    const dialogRef = this.sharedComponents.openDialogConfirmation(
      'warning',
      'warn',
      'Attention',
      message,
      'Remove paymentMethod'
    );

    dialogRef.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.dialogRef.disableClose = true;
        this.showLoadingArea = true;
        this.databaseTimes = this.utils.resetTimes();
        this.paymentMethodApi
          .removePaymentMethod(this.endpointPaths)
          .pipe(
            catchError((err) => {
              this.showLoadingArea = true;
              this.dialogRef.disableClose = false;
              return throwError(err);
            })
          )
          .subscribe((res: IHttpResponse) => {
            this.showDoneButton = true;
            this.databaseTimes = this.utils.setTimes(res);
          });
      }
    });
  }
}
