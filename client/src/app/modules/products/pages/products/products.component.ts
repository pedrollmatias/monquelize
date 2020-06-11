import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'salePrice'];
  productsDataSouce = new MatTableDataSource<IProduct>();

  products: IProduct[];

  mongodbMongooseTime: number;

  constructor(private apiProducts: ApiProductService) {}

  ngOnInit(): void {
    this.resetData();
    this.apiProducts.getProducts().subscribe((productRes: IHttpRes) => {
      this.mongodbMongooseTime = productRes.time;
      this.products = <IProduct[]>productRes.res;
      this.setDataSource(this.products);
    });
  }

  setDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.products = undefined;
  }

  refreshComponent(): void {
    this.ngOnInit();
  }
}
