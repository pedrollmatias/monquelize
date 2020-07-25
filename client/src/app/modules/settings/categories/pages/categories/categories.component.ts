import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ICategory } from 'src/app/shared/models/category.model';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryDetailsComponent } from '../../components/dialog-category-details/dialog-category-details.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.categoriesDataSource.paginator = paginator;
  }

  categoriesColumns: string[] = ['path', 'name'];
  categoriesDataSource = new MatTableDataSource<ICategory>();

  constructor(private categoryApi: ApiCategoryService, private dialog: MatDialog) {}

  categories: ICategory[];

  mongodbMongooseTime: number;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.categoryApi.getCategories().subscribe((categoryRes) => {
      this.categories = <ICategory[]>categoryRes.res;
      this.mongodbMongooseTime = categoryRes.time;
      this.setDataSource(this.categories);
    });
  }

  setDataSource(categories: ICategory[]): void {
    this.categoriesDataSource = new MatTableDataSource(categories);
    this.categoriesDataSource.paginator = this.paginator;
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.categories = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  openCategoryDetailsDialog(categoryId: string = null): void {
    const categoryDetailsDialogRef = this.dialog.open(DialogCategoryDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        categories: this.categories,
        categoryId: categoryId,
      },
    });

    categoryDetailsDialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.resetData();
            return this.categoryApi.getCategories();
          } else {
            const categoryRes: IHttpRes = { res: this.categories, time: this.mongodbMongooseTime };
            return of(categoryRes);
          }
        })
      )
      .subscribe((categoryRes: IHttpRes) => {
        this.categories = <ICategory[]>categoryRes.res;
        this.mongodbMongooseTime = categoryRes.time;
        this.setDataSource(this.categories);
      });
  }
}
