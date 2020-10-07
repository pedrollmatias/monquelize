import { Component, OnInit, Inject } from '@angular/core';
import { IUnit } from 'src/app/shared/models/views.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';

declare interface IUnitDialog {
  units: IUnit[];
  associatedIds?: IAssociatedIds;
}

@Component({
  selector: 'app-dialog-unit-details',
  templateUrl: './dialog-unit-details.component.html',
  styleUrls: ['./dialog-unit-details.component.scss'],
})
export class DialogUnitDetailsComponent implements OnInit {
  units: IUnit[];
  unit: IUnit;

  associatedIds: IAssociatedIds;

  unitForm: FormGroup;

  databaseTimes: IDatabaseTimes;

  dialogTitle: string;

  isNewUnit: boolean;

  endpointPaths: IPaths;

  showLoadingArea = false;
  showDoneButton = false;
  showForm = false;

  constructor(
    private unitApi: ApiUnitService,
    @Inject(MAT_DIALOG_DATA) public data: IUnitDialog,
    public dialogRef: MatDialogRef<DialogUnitDetailsComponent>,
    private fb: FormBuilder,
    private sharedComponents: SharedComponentsService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.units = this.data.units;
    this.associatedIds = this.data.associatedIds;
    this.isNewUnit = this.associatedIds ? false : true;
    if (!this.isNewUnit) {
      this.dialogTitle = 'Edit unit';
      this.showLoadingArea = true;
      this.endpointPaths = this.getEndpointPaths(this.associatedIds);
      this.unitApi.getUnit(this.endpointPaths).subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        this.unit = { ...res?.mongodbMongoose?.res, associatedIds: this.associatedIds };
        this.createUnitForm();
        this.initFormData(this.unit);
        this.showForm = true;
      });
    } else {
      this.dialogTitle = 'Add unit';
      this.createUnitForm();
      this.showForm = true;
    }
  }

  getEndpointPaths(associatedIds: IAssociatedIds): IPaths {
    return {
      mongodbMongoose: `/units/${associatedIds.mongodbMongooseId}`,
      postgresSequelize: `/units/${associatedIds.postgresSequelizeId}`,
    };
  }

  closeDialog(confirmed: boolean = null): void {
    this.dialogRef.close({ confirmed: confirmed });
  }

  createUnitForm(): void {
    this.unitForm = this.fb.group({
      unit: [null, Validators.required],
      shortUnit: [null, Validators.required],
      decimalPlaces: undefined,
    });
  }

  initFormData(unit: IUnit): void {
    this.unitForm.patchValue(unit);
  }

  formatUnit(unit: IUnit): IUnit {
    if (!unit.decimalPlaces) {
      unit.decimalPlaces = null;
    }
    return unit;
  }

  saveUnit(): void {
    if (this.unitForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      this.databaseTimes = this.utils.resetTimes();
      this.showForm = false;
      const unit = this.formatUnit(this.unitForm.value);
      if (this.isNewUnit) {
        this.unitApi.createUnit(unit).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      } else {
        this.unitApi.editUnit(this.endpointPaths, unit).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      }
    }
  }

  removeUnit(): void {
    const message = 'This unit will be removed. Are you sure you want to perform this action?';
    const dialogRef = this.sharedComponents.openDialogConfirmation(
      'warning',
      'warn',
      'Attention',
      message,
      'Remove unit'
    );

    dialogRef.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.dialogRef.disableClose = true;
        this.showLoadingArea = true;
        this.databaseTimes = this.utils.resetTimes();
        this.unitApi
          .removeUnit(this.endpointPaths)
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
