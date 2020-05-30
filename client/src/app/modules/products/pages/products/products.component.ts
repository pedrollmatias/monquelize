import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IProduct } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'salePrice'];
  productsDataSouce = new MatTableDataSource<IProduct>();

  constructor(private apiProducts: ApiProductService) {}

  ngOnInit(): void {
    this.apiProducts.getProducts().subscribe((products) => {
      this.setProductsDataSource(products);
    });
  }

  setProductsDataSource(products: IProduct[]): void {
    this.productsDataSouce = new MatTableDataSource(products);
  }
}
