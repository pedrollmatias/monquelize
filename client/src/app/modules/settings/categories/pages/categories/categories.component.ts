import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ICategory } from 'src/app/shared/models/views.model';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryDetailsComponent } from '../../components/dialog-category-details/dialog-category-details.component';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatPaginator } from '@angular/material/paginator';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse, IApiRes } from 'src/app/shared/models/http.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

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

  categories: ICategory[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(private categoryApi: ApiCategoryService, private dialog: MatDialog, public utils: UtilsService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.categoryApi.getCategories().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.categories = this.getCategories(res);
      this.setDataSource(this.categories);
    });
  }

  getCategories(res: IHttpResponse): ICategory[] {
    const categoriesByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(categoriesByServer, 'path');
  }

  setDataSource(categories: ICategory[]): void {
    this.categoriesDataSource = new MatTableDataSource(categories);
    this.categoriesDataSource.paginator = this.paginator;
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.categories = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  openCategoryDetailsDialog(associatedIds?: IAssociatedIds): void {
    const categoryDetailsDialogRef = this.dialog.open(DialogCategoryDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        categories: this.categories,
        associatedIds: associatedIds,
      },
    });

    categoryDetailsDialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.resetData();
            return this.categoryApi.getCategories();
          }
          return of(null);
        }),
        map((res) => (res ? { confirmed: true, res } : { confirmed: false }))
      )
      .subscribe(({ confirmed, res }: { confirmed: Boolean; res?: IHttpResponse }) => {
        if (confirmed) {
          this.databaseTimes = this.utils.setTimes(res);
          this.categories = this.getCategories(res);
          this.setDataSource(this.categories);
        }
      });
  }
}
