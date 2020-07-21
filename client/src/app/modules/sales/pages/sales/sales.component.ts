import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  salesColumns: string[] = ['code', 'date', 'customer', 'totalValue', 'seller', 'status'];
  salesDataSource: MatTableDataSource<any>;

  constructor(private saleApi: ApiSaleService) {}

  sales: any[];

  mongodbMongooseTime: number;

  ngOnInit(): void {
    this.resetData();
    this.saleApi.getSales().subscribe((saleRes) => {
      this.sales = <any[]>saleRes.res;
      console.log(this.sales);
      this.mongodbMongooseTime = saleRes.time;
      this.setDataSource(this.sales);
    });
  }

  setDataSource(sales: any[]): void {
    this.salesDataSource = new MatTableDataSource(sales);
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.sales = undefined;
  }

  refreshComponent(): void {
    this.ngOnInit();
  }
}
