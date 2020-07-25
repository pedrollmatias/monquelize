import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiPurchaseService } from 'src/app/core/api/api-purchase.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatPaginator } from '@angular/material/paginator';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.purchasesDataSource.paginator = paginator;
  }

  purchases: any[];

  mongodbMongooseTime: number;

  purchasesColumns: string[] = ['code', 'date', 'vendor', 'totalValue', 'buyer', 'status'];
  purchasesDataSource = new MatTableDataSource<any>();

  dateRange: IDateRange;

  constructor(private purchaseApi: ApiPurchaseService, public utils: UtilsService) {}

  ngOnInit(): void {
    this.dateRange = this.utils.getMonthRange(this.utils.getCurrentDate());
    this.fetchData();
  }

  fetchData(): void {
    const query = { startDate: this.dateRange.start.toString(), endDate: this.dateRange.end.toString() };
    this.purchaseApi.getPurchases(query).subscribe((purchaseRes) => {
      this.purchases = <any[]>purchaseRes.res;
      this.mongodbMongooseTime = purchaseRes.time;
      this.setDataSource(this.purchases);
    });
  }

  setDataSource(purchases: any[]): void {
    this.purchasesDataSource = new MatTableDataSource(purchases);
    this.purchasesDataSource.paginator = this.paginator;
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.purchases = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  onDateRangeChange(dateSelector: IDateSelector): void {
    this.dateRange = dateSelector.dateRange;
    this.resetData();
    this.fetchData();
  }
}
