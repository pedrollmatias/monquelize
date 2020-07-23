import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct } from 'src/app/shared/models/product.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  productsColumns: string[] = ['sku', 'name', 'category', 'unit', 'currentAmount'];
  productsDataSouce = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.productsDataSouce.paginator = paginator;
  }

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
