import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiInventoryService } from 'src/app/core/api/api-inventory.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IProduct } from 'src/app/shared/models/views.model';

declare interface IAddInventoryMovementDialog {
  product: IProduct;
}

@Component({
  selector: 'app-dialog-add-inventory-movement',
  templateUrl: './dialog-add-inventory-movement.component.html',
  styleUrls: ['./dialog-add-inventory-movement.component.scss'],
})
export class DialogAddInventoryMovementComponent implements OnInit {
  product: IProduct;

  addInventoryMovementForm: FormGroup;

  databaseTimes: IDatabaseTimes;

  showLoadingArea = false;
  showDoneButton = false;

  movementTypes = [
    { name: 'Input', value: '100' },
    { name: 'Output', value: '200' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAddInventoryMovementDialog,
    public dialogRef: MatDialogRef<DialogAddInventoryMovementComponent>,
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
    this.addInventoryMovementForm = this.fb.group({
      movementType: [null, Validators.required],
      amount: [null, Validators.required],
    });
  }

  clearForm(): void {
    this.addInventoryMovementForm.reset();
    this.addInventoryMovementForm.clearValidators();
  }

  saveInventoryMovement(): void {
    if (this.addInventoryMovementForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      const endpointPaths = this.utils.getEndpointPaths(
        '/inventory/add-inventory-movement',
        this.product.associatedIds
      );
      console.log(endpointPaths);
      this.inventoryApi
        .addInventoryMovement(endpointPaths, this.addInventoryMovementForm.value)
        .subscribe((res: IHttpResponse) => {
          console.log(res);
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
    }
  }
}
