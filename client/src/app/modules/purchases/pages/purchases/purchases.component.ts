import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { ApiPurchaseService } from 'src/app/core/api/api-purchase.service';
import { MatPaginator } from '@angular/material/paginator';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { IPurchase } from 'src/app/shared/models/views.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  purchasesColumns: string[] = ['code', 'date', 'vendor', 'totalValue', 'seller'];
  purchasesDataSource = new MatTableDataSource<IPurchase>();

  purchases: IPurchase[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  dateRange: IDateRange;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseApi: ApiPurchaseService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.dateRange = this.utils.getMonthRange(this.utils.getCurrentDate());
    this.fetchData();
  }

  fetchData(): void {
    const query = { startDate: this.dateRange.start.toString(), endDate: this.dateRange.end.toString() };
    this.purchaseApi.getPurchases(query).subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.purchases = this.getPurchases(res);
      this.setDataSource(this.purchases);
    });
  }

  getPurchases(res: IHttpResponse): IPurchase[] {
    const purchasesByServer: IHttpResponse = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(purchasesByServer, 'timestamp');
  }

  setDataSource(purchase: IPurchase[]): void {
    this.purchasesDataSource = new MatTableDataSource(purchase);
    this.purchasesDataSource.paginator = this.paginator;
  }

  navigateToEditPurchase(purchase: IPurchase): void {
    const params = {
      ...(purchase.associatedIds.postgresSequelizeId && {
        postgresSequelize: purchase.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', purchase._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
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
