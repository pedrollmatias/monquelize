import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct } from 'src/app/shared/models/views.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { MatPaginator } from '@angular/material/paginator';
import { UtilsService } from 'src/app/core/services/utils.service';

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

  constructor(private apiProducts: ApiProductService, public utils: UtilsService) {}

  ngOnInit(): void {
    // this.fetchData();
  }

  // fetchData(): void {
  //   this.apiProducts.getProducts().subscribe((productRes: IHttpRes) => {
  //     this.mongodbMongooseTime = productRes.time;
  //     this.products = <IProduct[]>productRes.res;
  //     this.setDataSource(this.products);
  //   });
  // }

  // setDataSource(products: IProduct[]): void {
  //   this.productsDataSouce = new MatTableDataSource(products);
  // }

  // resetData(): void {
  //   this.mongodbMongooseTime = null;
  //   this.products = undefined;
  // }

  // refreshComponent(): void {
  //   this.resetData();
  //   this.fetchData();
  // }
}
