import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiReportService } from 'src/app/core/api/api-report.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { IHttpResponse } from 'src/app/shared/models/http.model';

@Component({
  selector: 'app-element-sales-products-category-by-date-range',
  templateUrl: './element-sales-products-category-by-date-range.component.html',
  styleUrls: ['./element-sales-products-category-by-date-range.component.scss'],
})
export class ElementSalesProductsCategoryByDateRangeComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  dateSelector: IDateSelector;

  productsAmountChartResult: any = [];
  productsTotalChartResult: any = [];

  showChartData = false;

  report: any;

  databaseTimes: IDatabaseTimes;

  constructor(private reportApi: ApiReportService, public utils: UtilsService) {}

  ngOnInit(): void {
    this.dateSelector = {
      type: 'month',
      dateRange: this.utils.getMonthRange(this.utils.getCurrentDate()),
    };
    this.fetchData();
  }

  fetchData(): void {
    const query = {
      startDate: this.dateSelector.dateRange.start.toString(),
      endDate: this.dateSelector.dateRange.end.toString(),
    };
    this.reportApi.getSalesProductsByCategoryByDateRange(query).subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.report = res.mongodbMongoose.res;
      this.setChartsData(this.report);
      this.showChartData = true;
    });
  }

  onDateRangeChange(dateSelector: IDateSelector): void {
    this.showChartData = false;
    this.databaseTimes = this.utils.resetTimes();
    this.dateSelector = dateSelector;
    this.fetchData();
  }

  setChartsData(data: any): void {
    this.setSalesAmountChartData(data);
    this.setSalesTotalChartData(data);
  }

  setSalesAmountChartData(data: any): void {
    this.productsAmountChartResult = data.map((info) => {
      return {
        name: info.category,
        value: info.amount,
      };
    });
  }

  setSalesTotalChartData(data: any): void {
    this.productsTotalChartResult = data.map((info) => {
      return {
        name: info.category,
        value: info.total,
      };
    });
  }
}
