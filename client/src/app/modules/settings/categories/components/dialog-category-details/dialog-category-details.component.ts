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

declare interface ICategoryDialog {
  categories: ICategory[];
  categoryId: string;
}

@Component({
  selector: 'app-dialog-category-details',
  templateUrl: './dialog-category-details.component.html',
  styleUrls: ['./dialog-category-details.component.scss'],
})
export class DialogCategoryDetailsComponent implements OnInit {
  categories: ICategory[];
  associatedIds: IAssociatedIds;
  categoryForm: FormGroup;

  category: ICategory;
  databaseTimes: IDatabaseTimes;

  dialogTitle: string;

  isNewCategory: boolean;

  showLoadingArea = false;
  showDoneButton = false;

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
    // this.categoryId = this.data.categoryId;
    this.isNewCategory = this.associatedIds ? false : true;
    if (!this.isNewCategory) {
      //   this.showLoadingArea = true;
      //   this.categoryApi.getCategory(this.categoryId).subscribe((categoryRes) => {
      //     this.category = categoryRes.res;
      //     this.mongodbMongooseTime = categoryRes.time;
      //     this.createCategoryForm();
      //     this.initFormData(this.category);
      //     this.dialogTitle = 'Edit category';
      //   });
    } else {
      this.createCategoryForm();
      this.dialogTitle = 'Add category';
    }
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
    this.categoryForm.setValue({
      name: category.name,
      parent: category.parent || '',
    });
  }

  compareCategories(option: any, selection: any) {
    return option?._id === selection?._id;
  }

  formatCategory(category: ICategory): ICategory {
    if (!category.parent) {
      category.parent = undefined;
    }
    return category;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      this.dialogRef.disableClose = true;
      this.showLoadingArea = true;
      const category = this.formatCategory(this.categoryForm.value);
      // if (this.isNewCategory) {
      this.categoryApi.createCategory(category).subscribe((res: IHttpResponse) => {
        this.showDoneButton = true;
        this.databaseTimes = this.utils.setTimes(res);
      });
      // } else {
      //   this.categoryApi.editCategory(this.categoryId, category).subscribe((categoryRes: IHttpRes) => {
      //     this.showDoneButton = true;
      //     this.mongodbMongooseTime = categoryRes.time;
      //   });
      // }
    }
  }

  removeCategory(): void {
    const message = 'This unit category be removed. Are you sure you want to perform this action?';
    const dialogRef = this.sharedComponents.openDialogConfirmation(
      'warning',
      'warn',
      'Attention',
      message,
      'Remove category'
    );

    dialogRef
      .beforeClosed()
      // .pipe(
      //   switchMap(confirmed => {

      //   })
      // )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.dialogRef.disableClose = true;
          this.showLoadingArea = true;
          const databaseTimesBkp = Object.assign({}, this.databaseTimes);
          this.databaseTimes = this.utils.resetTimes();
          // this.categoryApi
          //   .removeCategory(this.categoryId)
          //   .pipe(
          //     catchError((err) => {
          //       this.showLoadingArea = true;
          //       this.mongodbMongooseTime = mongodbMongooseTimeBkp;
          //       this.dialogRef.disableClose = false;
          //       return throwError(err);
          //     })
          //   )
          //   .subscribe((categoryRes: IHttpRes) => {
          //     this.showDoneButton = true;
          //     this.mongodbMongooseTime = categoryRes.time;
          //   });
        }
      });
  }
}
