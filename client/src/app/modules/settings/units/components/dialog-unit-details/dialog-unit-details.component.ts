import { Component, OnInit, Inject } from '@angular/core';
import { IUnit } from 'src/app/shared/models/views.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';

declare interface IUnitDialog {
  units: IUnit[];
  unitId: string;
}

@Component({
  selector: 'app-dialog-unit-details',
  templateUrl: './dialog-unit-details.component.html',
  styleUrls: ['./dialog-unit-details.component.scss'],
})
export class DialogUnitDetailsComponent implements OnInit {
  units: IUnit[];
  unitId: string;
  unitForm: FormGroup;

  unit: IUnit;
  mongodbMongooseTime: number;

  dialogTitle: string;

  isNewUnit: boolean;

  showLoadingArea = false;
  showDoneButton = false;

  constructor(
    public dialogRef: MatDialogRef<DialogUnitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUnitDialog,
    private fb: FormBuilder,
    private unitApi: ApiUnitService,
    private sharedComponents: SharedComponentsService
  ) {}

  ngOnInit(): void {
    // this.units = this.data.units;
    // this.unitId = this.data.unitId;
    // this.isNewUnit = this.unitId ? false : true;
    // if (!this.isNewUnit) {
    //   this.showLoadingArea = true;
    //   this.unitApi.getUnit(this.unitId).subscribe((unitRes) => {
    //     this.unit = unitRes.res;
    //     this.mongodbMongooseTime = unitRes.time;
    //     this.createUnitForm();
    //     this.initFormData(this.unit);
    //     this.dialogTitle = 'Edit unit';
    //   });
    // } else {
    //   this.createUnitForm();
    //   this.dialogTitle = 'Add unit';
    // }
  }

  // resetTimes(): void {
  //   this.mongodbMongooseTime = null;
  // }

  // closeDialog(confirmed: boolean = null): void {
  //   this.dialogRef.close({ confirmed: confirmed });
  // }

  // createUnitForm(): void {
  //   this.unitForm = this.fb.group({
  //     unit: [null, Validators.required],
  //     shortUnit: [null, Validators.required],
  //     decimalPlaces: undefined,
  //   });
  // }

  // initFormData(unit: IUnit): void {
  //   this.unitForm.patchValue(unit);
  // }

  // formatUnit(unit: IUnit): IUnit {
  //   if (!unit.decimalPlaces) {
  //     unit.decimalPlaces = undefined;
  //   }
  //   return unit;
  // }

  // saveUnit(): void {
  //   if (this.unitForm.invalid) {
  //     this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //   } else {
  //     this.dialogRef.disableClose = true;
  //     this.showLoadingArea = true;
  //     const unit = this.formatUnit(this.unitForm.value);
  //     if (this.isNewUnit) {
  //       this.unitApi.createUnit(unit).subscribe((unitRes: IHttpRes) => {
  //         this.showDoneButton = true;
  //         this.mongodbMongooseTime = unitRes.time;
  //       });
  //     } else {
  //       this.unitApi.editUnit(this.unitId, unit).subscribe((unitRes: IHttpRes) => {
  //         this.showDoneButton = true;
  //         this.mongodbMongooseTime = unitRes.time;
  //       });
  //     }
  //   }
  // }

  // removeUnit(): void {
  //   const message = 'This unit will be removed. Are you sure you want to perform this action?';
  //   const dialogRef = this.sharedComponents.openDialogConfirmation(
  //     'warning',
  //     'warn',
  //     'Attention',
  //     message,
  //     'Remove unit'
  //   );

  //   dialogRef.beforeClosed().subscribe((confirmed) => {
  //     if (confirmed) {
  //       this.dialogRef.disableClose = true;
  //       this.showLoadingArea = true;
  //       const mongodbMongooseTimeBkp = this.mongodbMongooseTime;
  //       this.resetTimes();
  //       this.unitApi
  //         .removeUnit(this.unitId)
  //         .pipe(
  //           catchError((err) => {
  //             this.showLoadingArea = true;
  //             this.mongodbMongooseTime = mongodbMongooseTimeBkp;
  //             this.dialogRef.disableClose = false;
  //             return throwError(err);
  //           })
  //         )
  //         .subscribe((unitRes: IHttpRes) => {
  //           this.showDoneButton = true;
  //           this.mongodbMongooseTime = unitRes.time;
  //         });
  //     }
  //   });
  // }
}
