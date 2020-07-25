import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { MatPaginator } from '@angular/material/paginator';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.salesDataSource.paginator = paginator;
  }

  sales: any[];

  mongodbMongooseTime: number;

  salesColumns: string[] = ['code', 'date', 'customer', 'totalValue', 'seller', 'status'];
  salesDataSource = new MatTableDataSource<any>();

  dateRange: IDateRange;

  constructor(private saleApi: ApiSaleService, public utils: UtilsService) {}

  ngOnInit(): void {
    this.dateRange = this.utils.getMonthRange(this.utils.getCurrentDate());
    this.fetchData();
  }

  fetchData(): void {
    const query = { startDate: this.dateRange.start.toString(), endDate: this.dateRange.end.toString() };
    this.saleApi.getSales(query).subscribe((saleRes) => {
      this.sales = <any[]>saleRes.res;
      this.mongodbMongooseTime = saleRes.time;
      this.setDataSource(this.sales);
    });
  }

  setDataSource(sales: any[]): void {
    this.salesDataSource = new MatTableDataSource(sales);
    this.salesDataSource.paginator = this.paginator;
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.sales = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  onDateRangeChange(dateRange: IDateRange): void {
    this.dateRange = dateRange;
    this.resetData();
    this.fetchData();
  }
}
