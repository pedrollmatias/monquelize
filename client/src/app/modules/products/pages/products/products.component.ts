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

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.productsDataSouce.paginator = paginator;
  }

  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'salePrice'];
  productsDataSouce = new MatTableDataSource<IProduct>();

  products: IProduct[];

  databaseTimes: IDatabaseTimes;

  constructor(
    private apiProducts: ApiProductService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.apiProducts.getProducts().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.products = this.getProducts(res);
      this.setDataSource(this.products);
    });
  }

  getProducts(res: IHttpResponse): IProduct[] {
    const products = Object.keys(res).reduce(
      (products, key) => {
        products[key] = res[key].res;
        return products;
      },
      { mongodbMongoose: [], postgresSequelize: [] }
    );

    return products.mongodbMongoose.map((product, _, _products) => {
      const associatedIds = {
        mongodbMongooseId: product._id,
        postgresSequelizeId: product._id,
      };

      return { ...product, associatedIds };
    });
  }

  setDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
    this.productsDataSouce.paginator = this.paginator;
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
