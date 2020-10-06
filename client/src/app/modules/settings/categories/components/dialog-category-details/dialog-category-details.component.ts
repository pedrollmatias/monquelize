import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ICategory } from 'src/app/shared/models/views.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';

declare interface ICategoryDialog {
  categories: ICategory[];
  associatedIds?: IAssociatedIds;
}

@Component({
  selector: 'app-dialog-category-details',
  templateUrl: './dialog-category-details.component.html',
  styleUrls: ['./dialog-category-details.component.scss'],
})
export class DialogCategoryDetailsComponent implements OnInit {
  categories: ICategory[];
  category: ICategory;

  associatedIds: IAssociatedIds;

  categoryForm: FormGroup;

  databaseTimes: IDatabaseTimes;

  dialogTitle: string;

  isNewCategory: boolean;

  endpointPaths: IPaths;

  showLoadingArea = false;
  showDoneButton = false;
  showForm = false;

  constructor(
    private categoryApi: ApiCategoryService,
    @Inject(MAT_DIALOG_DATA) public data: ICategoryDialog,
    public dialogRef: MatDialogRef<DialogCategoryDetailsComponent>,
    private fb: FormBuilder,
    private sharedComponents: SharedComponentsService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.categories = this.data.categories;
    this.associatedIds = this.data.associatedIds;
    this.isNewCategory = this.associatedIds ? false : true;
    if (!this.isNewCategory) {
      this.dialogTitle = 'Edit category';
      this.showLoadingArea = true;
      this.endpointPaths = this.getEndpointPaths(this.associatedIds);
      this.categoryApi.getCategory(this.endpointPaths).subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        this.category = { ...res?.mongodbMongoose?.res, associatedIds: this.associatedIds };
        this.createCategoryForm();
        this.initFormData(this.category);
        this.showForm = true;
      });
    } else {
      this.dialogTitle = 'Add category';
      this.createCategoryForm();
      this.showForm = true;
    }
  }

  getEndpointPaths(associatedIds: IAssociatedIds): IPaths {
    return {
      mongodbMongoose: `/categories/${associatedIds.mongodbMongooseId}`,
      postgresSequelize: `/categories/${associatedIds.postgresSequelizeId}`,
    };
  }

  closeDialog(confirmed: boolean = null): void {
    this.dialogRef.close({ confirmed: confirmed });
  }

  createCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      parent: '',
    });
  }

  initFormData(category: ICategory): void {
    if (category.parent) {
      category.parent = { ...category.parent, associatedIds: this.getParentAssociatedIds() };
    }

    this.categoryForm.setValue({
      name: category.name,
      parent: category.parent || '',
    });
  }

  getParentAssociatedIds(): IAssociatedIds {
    return {
      mongodbMongooseId: this.category.parent,
      postgresSequelizeId: this.categories.find((category) => category._id === this.category.parent?._id)?.associatedIds
        ?.postgresSequelizeId,
    };
  }

  compareCategories(option: any, selection: any) {
    return option?._id === selection?._id;
  }

  formatCategory(category: ICategory): ICategory {
    if (!category.parent) {
      category.parent = null;
    }

    return category;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      this.databaseTimes = this.utils.resetTimes();
      this.showForm = false;
      const category = this.formatCategory(this.categoryForm.value);
      if (this.isNewCategory) {
        this.categoryApi.createCategory(category).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      } else {
        this.categoryApi.editCategory(this.endpointPaths, category).subscribe((res: IHttpResponse) => {
          this.showDoneButton = true;
          this.databaseTimes = this.utils.setTimes(res);
        });
      }
    }
  }

  removeCategory(): void {
    const message = 'This category will be removed. Are you sure you want to perform this action?';
    const dialogRef = this.sharedComponents.openDialogConfirmation(
      'warning',
      'warn',
      'Attention',
      message,
      'Remove category'
    );

    dialogRef.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.dialogRef.disableClose = true;
        this.showLoadingArea = true;
        this.databaseTimes = this.utils.resetTimes();
        this.categoryApi
          .removeCategory(this.endpointPaths)
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
