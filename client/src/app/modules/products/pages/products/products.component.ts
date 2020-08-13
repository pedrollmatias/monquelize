import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { MatPaginator } from '@angular/material/paginator';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { UtilsService } from 'src/app/core/services/utils.service';
import { forkJoin } from 'rxjs';

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

  times: IDatabaseTimes;

  constructor(public utils: UtilsService, private apiProducts: ApiProductService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    forkJoin(this.apiProducts.getProducts(this.utils.mongodbMongooseBaseUrl)).subscribe((databasesRes: IHttpRes[]) => {
      const [mongodbMongooseProductRes] = databasesRes;
      this.times = this.utils.setTimes(mongodbMongooseProductRes.time);
      this.products = <IProduct[]>mongodbMongooseProductRes.res;
      this.setDataSource(this.products);
    });
  }

  setDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
    this.productsDataSouce.paginator = this.paginator;
  }

  resetData(): void {
    this.times = this.utils.resetTimes();
    this.products = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }
}
