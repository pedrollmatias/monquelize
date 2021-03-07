import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiReportService } from 'src/app/core/api/api-report.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { IHttpResponse } from 'src/app/shared/models/http.model';

declare interface IChartResult {
  showChartData: boolean;
  times: any;
  showForm?: boolean;
  requestAttempt?: boolean;
}

declare interface IChartsResults {
  salesAmountByDate: any;
  salesTotalByDate: any;
  salesAmountByCategory: any;
  salesTotalByCategory: any;
  advancedSalesReport: any;
}

@Component({
  selector: 'app-element-sales-amount-total-by-date-range',
  templateUrl: './element-sales-amount-total-by-date-range.component.html',
  styleUrls: ['./element-sales-amount-total-by-date-range.component.scss'],
})
export class ElementSalesAmountTotalByDateRangeComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  dateSelector: IDateSelector;

  salesAmountChartResult: any = [];
  salesTotalChartResult: any = [];

  showChartData = false;

  report: any;

  databaseTimes: IDatabaseTimes;

  constructor(private reportApi: ApiReportService, public utils: UtilsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dateSelector = { type: 'month', dateRange: this.utils.getMonthRange(this.utils.getCurrentDate()) };
    const query = {
      startDate: this.dateSelector.dateRange.start.toString(),
      endDate: this.dateSelector.dateRange.end.toString(),
    };
    this.reportApi.getSalesAmountByDateRange(query).subscribe((res: IHttpResponse) => {
      console.log(res.postgresSequelize.res);
      this.databaseTimes = this.utils.setTimes(res);
      this.report = res.mongodbMongoose.res;
      this.setChartsData(this.report);
      this.showChartData = true;
    });
    // this.initSalesReportsResControl();
    // this.initChartsData();
    // this.dateSelectorSaleByDate = { type: 'month', dateRange: this.utils.getMonthRange(this.utils.getCurrentDate()) };
    // this.dateSelectorSaleByCategory = { ...this.dateSelectorSaleByDate };
    // const query = {
    //   startDate: this.dateSelectorSaleByDate.dateRange.start.toString(),
    //   endDate: this.dateSelectorSaleByDate.dateRange.end.toString(),
    // };
    // forkJoin(
    //   this.reportApi.getSalesAmountByDateRange(query),
    //   this.reportApi.getSalesByCatgoryByDateRange(query),
    //   this.categoryApi.getCategories(),
    //   this.unitApi.getUnits(),
    //   this.userApi.getUsers(),
    //   // this.productApi.getProducts(),
    //   this.paymentMethodApi.getPaymentMethods()
    // ).subscribe((res: IHttpRes[]) => {
    //   const [salesByDateRes, salesByCategoryRes] = res;
    //   const apiRes = res.slice(2).map((_apiRes) => _apiRes.res);
    //   [this.categories, this.units, this.sellers, this.products, this.paymentMethods] = apiRes;
    //   this.filteredProducts = [...this.products];
    //   this.salesReportsResControl.salesByDate.times.mognodbMongoose = salesByDateRes.time;
    //   this.salesReportsResControl.salesByCategory.times.mognodbMongoose = salesByCategoryRes.time;
    //   this.setSalesByDateChartsData(salesByDateRes.res);
    //   this.setSaleAmountByCategoryChartData(salesByCategoryRes.res);
    //   this.setSaleTotalByCategoryChartData(salesByCategoryRes.res);
    //   this.createAdvancedSearchForm();
    //   this.salesReportsResControl.salesByDate.showChartData = true;
    //   this.salesReportsResControl.salesByCategory.showChartData = true;
    //   this.salesReportsResControl.advancedReport.showForm = true;
    // });
  }

  // initSalesReportsResControl(): void {
  //   this.salesReportsResControl = {
  //     salesByDate: {
  //       showChartData: false,
  //       times: {},
  //     },
  //     salesByCategory: {
  //       showChartData: false,
  //       times: {},
  //     },
  //     advancedReport: {
  //       showChartData: false,
  //       times: {},
  //       showForm: false,
  //       requestAttempt: false,
  //     },
  //   };
  // }

  // initChartsData(): void {
  //   this.chartsResults = {
  //     salesAmountByDate: [],
  //     salesTotalByDate: [],
  //     salesAmountByCategory: [],
  //     salesTotalByCategory: [],
  //     advancedSalesReport: [],
  //   };
  // }

  // generateChartColorScheme(colorsAmount: number): any {
  //   return {
  //     domain: Array(colorsAmount)
  //       .fill(null)
  //       .map((_, i) => 'rgba(0, 96, 100, ' + (i + 1) * (1 / colorsAmount) + ')'),
  //   };
  // }

  onDateRangeChange(dateSelector: IDateSelector): void {
    this.showChartData = false;
    // this.salesReportsResControl.salesByDate.times.mognodbMongoose = null;
    // this.dateSelectorSaleByDate = dateSelector;
    // const query = {
    //   startDate: this.dateSelectorSaleByDate.dateRange.start.toString(),
    //   endDate: this.dateSelectorSaleByDate.dateRange.end.toString(),
    // };
    // this.reportApi.getSalesAmountByDateRange(query).subscribe((salesReportRes: IHttpRes) => {
    //   this.salesReportsResControl.salesByDate.times.mognodbMongoose = salesReportRes.time;
    //   this.salesReportsResControl.salesByDate.showChartData = true;
    //   this.setSalesByDateChartsData(salesReportRes.res);
    // });
  }

  setChartsData(data: any): void {
    let monthDays: number;
    if (
      this.utils.getMonthName(this.dateSelector.dateRange.start) ===
        this.utils.getMonthName(this.utils.getCurrentDate()) &&
      this.utils.getFullYear(this.dateSelector.dateRange.start) === this.utils.getFullYear(this.utils.getCurrentDate())
    ) {
      monthDays = this.utils.getDayNumber(this.utils.getCurrentDate());
    } else {
      monthDays = this.utils.getMonthDaysAmount(this.dateSelector.dateRange.start);
    }
    this.setSalesAmountChartData(data, monthDays);
    this.setSalesTotalChartData(data, monthDays);
  }

  setSalesAmountChartData(data: any[], monthDays: number): void {
    const salesAmountSeries = [...Array(monthDays).keys()].map((_, i) => {
      const dayNumber = i + 1;
      return {
        name: dayNumber.toString().padStart(2, '0'),
        value: data.find((info) => this.utils.getDayNumber(info.date) === dayNumber)?.amount || 0,
      };
    });
    this.salesAmountChartResult = [
      {
        name: this.utils.getMonthName(this.dateSelector.dateRange.start),
        series: salesAmountSeries,
      },
    ];
  }

  setSalesTotalChartData(data: any[], monthDays: number): void {
    const salesTotalSeries = [...Array(monthDays).keys()].map((_, i) => {
      const dayNumber = i + 1;
      return {
        name: dayNumber.toString().padStart(2, '0'),
        value: data.find((info) => this.utils.getDayNumber(info.date) === dayNumber)?.total || 0,
      };
    });
    this.salesTotalChartResult = [
      {
        name: this.utils.getMonthName(this.dateSelector.dateRange.start),
        series: salesTotalSeries,
      },
    ];
  }

  // onDateRangeSaleByCategoryChange(dateSelector: IDateSelector): void {
  //   this.salesReportsResControl.salesByCategory.showChartData = false;
  //   this.salesReportsResControl.salesByCategory.times.mognodbMongoose = null;
  //   this.dateSelectorSaleByCategory = dateSelector;
  //   const query = {
  //     startDate: this.dateSelectorSaleByCategory.dateRange.start.toString(),
  //     endDate: this.dateSelectorSaleByCategory.dateRange.end.toString(),
  //   };
  //   this.reportApi.getSalesByCatgoryByDateRange(query).subscribe((salesReportRes: IHttpRes) => {
  //     this.salesReportsResControl.salesByCategory.times.mognodbMongoose = salesReportRes.time;
  //     this.salesReportsResControl.salesByCategory.showChartData = true;
  //     this.setSalesByCategoryChartsData(salesReportRes.res);
  //   });
  // }

  // setSalesByCategoryChartsData(data: any): void {
  //   this.setSaleAmountByCategoryChartData(data);
  //   this.setSaleTotalByCategoryChartData(data);
  // }

  // setSaleAmountByCategoryChartData(data: any): void {
  //   this.chartsResults.salesAmountByCategory = data.map((info) => {
  //     return {
  //       name: info.category,
  //       value: info.amount,
  //     };
  //   });
  // }

  // setSaleTotalByCategoryChartData(data: any): void {
  //   this.chartsResults.salesTotalByCategory = data.map((info) => {
  //     return {
  //       name: info.category,
  //       value: info.total,
  //     };
  //   });
  // }

  // createAdvancedSearchForm(): void {
  //   this.advancedSearchForm = this.fb.group({
  //     startDate: null,
  //     endDate: null,
  //     categories: [],
  //     units: [],
  //     products: [],
  //     paymentMethods: [],
  //     sellers: [],
  //   });
  // }

  // clearAdvancedSearchForm(): void {
  //   this.advancedSearchForm.setValue({
  //     startDate: null,
  //     endDate: null,
  //     categories: [],
  //     units: [],
  //     products: [],
  //     paymentMethods: [],
  //     sellers: [],
  //   });
  // }

  // onCategoriesChanges(categoriesId: string[]): void {
  //   categoriesId;
  //   this.filteredProducts = this.products.filter((product) => {
  //     const productCategory = <ICategory>product.category;
  //     return categoriesId.includes(productCategory?._id);
  //   });
  //   this.advancedSearchForm.patchValue({
  //     products: [],
  //     units: [],
  //   });
  // }

  // formatQueryParams(formValue: any): any {
  //   const formattedQuertParams = {};
  //   for (const key of Object.keys(formValue)) {
  //     if (formValue[key]) {
  //       formattedQuertParams[key] = formValue[key];
  //     }
  //   }
  //   return formattedQuertParams;
  // }

  // submitAdvancedSearch(): void {
  //   this.salesReportsResControl.advancedReport.requestAttempt = true;
  //   this.salesReportsResControl.advancedReport.showChartData = false;
  //   const queryParams = this.formatQueryParams(this.advancedSearchForm.value);
  //   this.reportApi.getAdvancesSalesReport(queryParams).subscribe((salesReportRes: IHttpRes) => {
  //     this.salesReportsResControl.advancedReport.times.mognodbMongoose = salesReportRes.time;
  //     this.salesReportsResControl.advancedReport.showChartData = true;
  //     this.chartsResults.advancedSalesReport = salesReportRes.res;
  //     this.setAdvancedSalesReportDataSource(this.chartsResults.advancedSalesReport);
  //   });
  // }

  // get amountAdvancedSalesReport(): number {
  //   return this.chartsResults.advancedSalesReport?.length;
  // }

  // get totalAdvancedSalesReport(): number {
  //   return (
  //     this.chartsResults.advancedSalesReport?.reduce((totalValue, sale) => (totalValue += sale.totalValue), 0) || 0
  //   );
  // }

  // setAdvancedSalesReportDataSource(sales: any[]): void {
  //   this.advancesSalesReportDataSouce = new MatTableDataSource(sales);
  //   this.advancesSalesReportDataSouce.paginator = this.paginator;
  // }
}
