import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ApiReportService } from 'src/app/core/api/api-report.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  dateSelectorSaleByDate: IDateSelector;
  salesAmountByDayMonthChartData: any[] = [];

  constructor(private reportApi: ApiReportService, public utils: UtilsService) {}

  ngOnInit(): void {
    this.dateSelectorSaleByDate = { type: 'month', dateRange: this.utils.getMonthRange(this.utils.getCurrentDate()) };
    const query = {
      startDate: this.dateSelectorSaleByDate.dateRange.start.toString(),
      endDate: this.dateSelectorSaleByDate.dateRange.end.toString(),
    };
    this.reportApi.getSalesAmountByDateRange(query).subscribe((salesReportRes: IHttpRes) => {
      this.displaySaleByDateChartDataByDayMonth(salesReportRes.res);
    });
  }

  onDateRangeSaleByDateChange(dateSelector: IDateSelector): void {
    this.dateSelectorSaleByDate = dateSelector;
    if (this.dateSelectorSaleByDate.type === 'month') {
      this.displaySaleByDateChartDataByDayMonth(dateSelector);
    }
  }

  displaySaleByDateChartDataByDayMonth(data: any): void {
    const monthDays = this.utils.getMonthDaysAmount(this.dateSelectorSaleByDate.dateRange.start);
    const salesAmountByDayMonthSeries = [...Array(monthDays).keys()].map((_, i) => {
      const dayNumber = i + 1;
      return {
        name: dayNumber.toString().padStart(2, '0'),
        value: data.find((day) => this.utils.getDayNumber(day.date) === dayNumber)?.amount || 0,
      };
    });
    this.salesAmountByDayMonthChartData = [
      {
        name: this.utils.getMonthName(this.dateSelectorSaleByDate.dateRange.start),
        series: salesAmountByDayMonthSeries,
      },
    ];
  }
}
