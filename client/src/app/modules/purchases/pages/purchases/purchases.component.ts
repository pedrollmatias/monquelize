import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiPurchaseService } from 'src/app/core/api/api-purchase.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  purchasesColumns: string[] = ['code', 'date', 'vendor', 'totalValue', 'buyer', 'status'];
  purchasesDataSource: MatTableDataSource<any>;

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
  }

  resetData(): void {
    this.mongodbMongooseTime = null;
    this.purchases = undefined;
  }

  refreshComponent(): void {
    this.ngOnInit();
  }
}
