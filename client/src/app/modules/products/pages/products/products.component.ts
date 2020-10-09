import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { MatPaginator } from '@angular/material/paginator';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IProduct } from 'src/app/shared/models/views.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.productsDataSource.paginator = paginator;
  }

  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'salePrice'];
  productsDataSource = new MatTableDataSource<IProduct>();

  products: IProduct[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private productApi: ApiProductService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.productApi.getProducts().subscribe((res: IHttpResponse) => {
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
    this.productsDataSource.paginator = this.paginator;
  }

  navigateToEditProduct(product: IProduct): void {
    const params = {
      ...(product.associatedIds.postgresSequelizeId && {
        postgresSequelize: product.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', product._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.products = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }
}
