import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { MatPaginator } from '@angular/material/paginator';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IProduct } from 'src/app/shared/models/views.model';
import { Router } from '@angular/router';
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

  constructor(public utils: UtilsService, private apiProducts: ApiProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.apiProducts.getProducts().subscribe((res: IHttpResponse) => {
      const { mongodbMongoose, postgresSequelize } = res;
      this.databaseTimes = this.utils.setTimes({
        postgresSequelize: postgresSequelize.time,
        mongodbMongoose: mongodbMongoose.time,
      });
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
        postgresSequelizeId: products.postgresSequelize.find((_product) => _product.sku === product.sku),
      };

      return { ...product, associatedIds };
    });
  }

  setDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
    this.productsDataSouce.paginator = this.paginator;
  }

  navigateToEditProduct(product: IProduct): void {
    this.router.navigate(['edit', { mongodbMongooseId: product._id }]);
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
