import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';
import { IProduct } from 'src/app/shared/models/views.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  searchProductFormControl = new FormControl();

  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'currentAmount'];
  productsDataSource = new MatTableDataSource<IProduct>();

  products: IProduct[];

  formControlHasValue = false;

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private productApi: ApiProductService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {}

  fetchData(searchValue: string): void {
    this.productApi.getProducts({ search: searchValue }).subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.products = this.getProducts(res);
      this.setDataSource(this.products);
    });
  }

  getProducts(res: IHttpResponse): IProduct[] {
    const productByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(productByServer, 'sku');
  }

  setDataSource(product: IProduct[]): void {
    this.productsDataSource = new MatTableDataSource(product);
  }

  navigateToProductInventoryDetails(product: IProduct): void {
    const params = {
      ...(product.associatedIds.postgresSequelizeId && {
        postgresSequelize: product.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate([product._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.products = undefined;
  }

  refreshComponent(): void {
    this.resetData();
  }

  onSearchFormControlChange(value: string) {
    if (value) {
      this.fetchData(value);
      this.formControlHasValue = true;
    } else {
      this.products = undefined;
      this.formControlHasValue = false;
    }
  }
}
