import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { MatPaginator } from '@angular/material/paginator';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { ISale } from 'src/app/shared/models/views.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  salesColumns: string[] = ['code', 'date', 'customer', 'totalValue', 'seller'];
  salesDataSource = new MatTableDataSource<ISale>();

  sales: ISale[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  dateRange: IDateRange;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saleApi: ApiSaleService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.dateRange = this.utils.getMonthRange(this.utils.getCurrentDate());
    this.fetchData();
  }

  fetchData(): void {
    const query = { startDate: this.dateRange.start.toString(), endDate: this.dateRange.end.toString() };
    this.saleApi.getSales(query).subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.sales = this.getSales(res);
      this.setDataSource(this.sales);
    });
  }

  getSales(res: IHttpResponse): ISale[] {
    const salesByServer: IHttpResponse = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(salesByServer, 'timestamp');
  }

  setDataSource(sale: ISale[]): void {
    this.salesDataSource = new MatTableDataSource(sale);
    this.salesDataSource.paginator = this.paginator;
  }

  navigateToEditSale(sale: ISale): void {
    const params = {
      ...(sale.associatedIds.postgresSequelizeId && {
        postgresSequelize: sale.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', sale._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.sales = undefined;
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
