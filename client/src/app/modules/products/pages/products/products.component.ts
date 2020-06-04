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

  mongodbMongooseTime: number;

  constructor(private apiProducts: ApiProductService) {}

  ngOnInit(): void {
    this.apiProducts.getProducts().subscribe((productRes: IHttpRes) => {
      this.mongodbMongooseTime = productRes.time;
      this.setProductsDataSource(productRes.res);
    });
  }

  setProductsDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
  }
}
