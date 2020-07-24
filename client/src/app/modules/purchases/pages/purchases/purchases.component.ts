import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiPurchaseService } from 'src/app/core/api/api-purchase.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatPaginator } from '@angular/material/paginator';
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

  purchasesColumns: string[] = ['code', 'date', 'vendor', 'totalValue', 'buyer', 'status'];
  purchasesDataSource = new MatTableDataSource<any>();

  constructor(private purchaseApi: ApiPurchaseService) {}

  purchases: any[];

  mongodbMongooseTime: number;

  ngOnInit(): void {
    this.resetData();
    this.purchaseApi.getPurchases().subscribe((purchaseRes) => {
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
    this.ngOnInit();
  }
}
