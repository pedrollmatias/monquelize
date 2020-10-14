import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProduct } from 'src/app/shared/models/views.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiInventoryService } from 'src/app/core/api/api-inventory.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';

declare interface IAdjustProductInventoryDialog {
  product: IProduct;
}

@Component({
  selector: 'app-dialog-adjust-product-inventory',
  templateUrl: './dialog-adjust-product-inventory.component.html',
  styleUrls: ['./dialog-adjust-product-inventory.component.scss'],
})
export class DialogAdjustProductInventoryComponent implements OnInit {
  product: IProduct;

  adjustProductInventoryForm: FormGroup;

  databaseTimes: IDatabaseTimes;

  showLoadingArea = false;
  showDoneButton = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAdjustProductInventoryDialog,
    public dialogRef: MatDialogRef<DialogAdjustProductInventoryComponent>,
    private fb: FormBuilder,
    private inventoryApi: ApiInventoryService,
    private sharedComponents: SharedComponentsService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.product = this.data.product;
    this.createAddInventoryMovementForm();
  }

  closeDialog(confirmed: boolean = null): void {
    this.dialogRef.close({ confirmed: confirmed });
  }

  createAddInventoryMovementForm(): void {
    this.adjustProductInventoryForm = this.fb.group({
      amount: [null, Validators.required],
    });
  }

  clearForm(): void {
    this.adjustProductInventoryForm.reset();
    this.adjustProductInventoryForm.clearValidators();
  }

  saveAdjustProductInventory(): void {
    if (this.adjustProductInventoryForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      const endpointPaths = this.utils.getEndpointPaths(
        '/inventory/adjust-product-inventory',
        this.product.associatedIds
      );
      this.inventoryApi
        .adjustProductInventory(endpointPaths, this.adjustProductInventoryForm.value)
        .subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
    }
  }
}
