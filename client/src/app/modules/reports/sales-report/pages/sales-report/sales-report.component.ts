import { Component, OnInit } from '@angular/core';
import { IDateRange } from 'src/app/shared/models/date-range.model';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  dateRangeSaleByDate: IDateRange;

  constructor() {}

  ngOnInit(): void {}

  onDateRangeSaleByDateChange(dateRange: IDateRange): void {
    this.dateRangeSaleByDate = dateRange;
    console.log(this.dateRangeSaleByDate);
  }
}
