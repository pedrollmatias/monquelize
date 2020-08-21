import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProduct } from 'src/app/shared/models/views.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';

declare interface IInventoryAdjustmentDialog {
  product: IProduct;
  productId: string;
}

@Component({
  selector: 'app-dialog-inventory-adjustment',
  templateUrl: './dialog-inventory-adjustment.component.html',
  styleUrls: ['./dialog-inventory-adjustment.component.scss'],
})
export class DialogInventoryAdjustmentComponent implements OnInit {
  product: IProduct;
  productId: string;

  inventoryAdjustmentForm: FormGroup;
  currentAmountAdjustmentForm: FormGroup;

  mongodbMongooseTime: number;

  dialogTitle: string;

  setCurrentAmount = false;

  showLoadingArea = false;
  showDoneButton = false;

  movementTypes = [
    { name: 'Input', value: '100' },
    { name: 'Output', value: '200' },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogInventoryAdjustmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInventoryAdjustmentDialog,
    private fb: FormBuilder,
    private sharedComponents: SharedComponentsService,
    private productApi: ApiProductService
  ) {}

  ngOnInit(): void {
    // this.product = this.data.product;
    // this.productId = this.data.productId;
    // this.createInventoryAdjustmentForm();
    // this.createCurrentAmountAdjustmentForm();
    // this.dialogTitle = 'Inventory adjustment';
  }

  // resetTimes(): void {
  //   this.mongodbMongooseTime = null;
  // }

  // closeDialog(confirmed: boolean = null): void {
  //   this.dialogRef.close({ confirmed: confirmed });
  // }

  // createInventoryAdjustmentForm(): void {
  //   this.inventoryAdjustmentForm = this.fb.group({
  //     movementType: [null, Validators.required],
  //     amount: [null, Validators.required],
  //   });
  // }

  // createCurrentAmountAdjustmentForm(): void {
  //   this.currentAmountAdjustmentForm = this.fb.group({
  //     currentAmount: [null, Validators.required],
  //   });
  // }

  // clearForms(): void {
  //   this.inventoryAdjustmentForm.reset();
  //   this.inventoryAdjustmentForm.clearValidators();
  //   this.currentAmountAdjustmentForm.reset();
  //   this.currentAmountAdjustmentForm.clearValidators();
  // }

  // saveInventoryAdjustment(): void {
  //   if (this.setCurrentAmount) {
  //     if (this.currentAmountAdjustmentForm.invalid) {
  //       this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //     } else {
  //       this.dialogRef.disableClose = true;
  //       this.showLoadingArea = true;
  //       const inventory = {
  //         ...this.product.inventory,
  //         currentAmount: this.currentAmountAdjustmentForm.get('currentAmount').value,
  //       };
  //       const productData = { ...this.product, inventory: inventory };
  //       this.productApi.editProduct(this.productId, productData).subscribe((productRes: IHttpRes) => {
  //         this.showDoneButton = true;
  //         this.mongodbMongooseTime = productRes.time;
  //       });
  //     }
  //   } else {
  //     if (this.inventoryAdjustmentForm.invalid) {
  //       this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //     } else {
  //       this.dialogRef.disableClose = true;
  //       this.showLoadingArea = true;
  //       this.productApi
  //         .inventoryAdjustment(this.productId, this.inventoryAdjustmentForm.value)
  //         .subscribe((productRes: IHttpRes) => {
  //           this.showDoneButton = true;
  //           this.mongodbMongooseTime = productRes.time;
  //         });
  //     }
  //   }
  // }
}
