import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ICategory } from 'src/app/shared/models/views.model';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryDetailsComponent } from '../../components/dialog-category-details/dialog-category-details.component';
import { switchMap, map } from 'rxjs/operators';
import { of, iif } from 'rxjs';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse, IApiRes } from 'src/app/shared/models/http.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';

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

  constructor(
    private categoryApi: ApiCategoryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

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
    const categories = Object.keys(res).reduce(
      (categories, serverId) => {
        categories[serverId] = res[serverId].res;
        return categories;
      },
      { mongodbMongoose: [], postgresSequelize: [] }
    );

    console.log(categories);

    return categories.mongodbMongoose.map((category, _, _categories) => {
      const associatedIds = {
        mongodbMongooseId: category._id,
        postgresSequelizeId: categories.postgresSequelize.find((_category) => _category.path === category.path)._id,
      };

      return { ...category, associatedIds };
    });
  }

  setDataSource(categories: ICategory[]): void {
    this.categoriesDataSource = new MatTableDataSource(categories);
    this.categoriesDataSource.paginator = this.paginator;
  }

  navigateToEditCategory(category: ICategory): void {
    const params = {
      ...(category.associatedIds.postgresSequelizeId && {
        postgresSequelize: category.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', category._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.categories = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  // fetchData(): void {
  //   this.categoryApi.getCategories().subscribe((categoryRes) => {
  //     this.categories = <ICategory[]>categoryRes.res;
  //     this.mongodbMongooseTime = categoryRes.time;
  //     this.setDataSource(this.categories);
  //   });
  // }

  // setDataSource(categories: ICategory[]): void {
  //   this.categoriesDataSource = new MatTableDataSource(categories);
  //   this.categoriesDataSource.paginator = this.paginator;
  // }

  // resetData(): void {
  //   this.mongodbMongooseTime = null;
  //   this.categories = undefined;
  // }

  // refreshComponent(): void {
  //   this.resetData();
  //   this.fetchData();
  // }

  openCategoryDetailsDialog(associatedIds?: IAssociatedIds): void {
    const categoryDetailsDialogRef = this.dialog.open(DialogCategoryDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        categories: this.categories,
        asssociatedIds: associatedIds,
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
