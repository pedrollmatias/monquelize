import { Component, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDateSelector } from 'src/app/shared/models/date-selector.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ApiReportService } from 'src/app/core/api/api-report.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ICategory } from 'src/app/shared/models/category.model';
import { IUnit } from 'src/app/shared/models/unit.model';
import { IUser } from 'src/app/shared/models/user.model';
import { IProduct } from 'src/app/shared/models/product.model';
import { IPaymentMethod } from 'src/app/shared/models/payment-method.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { IChartColorScheme } from 'src/app/shared/models/chart-color-scheme';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

declare interface ISalesReportResControl {
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

declare interface ISalesReportsResControl {
  salesByDate: ISalesReportResControl;
  salesByCategory: ISalesReportResControl;
  advancedReport: ISalesReportResControl;
}

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  categories: ICategory[];
  units: IUnit[];
  sellers: IUser[];
  products: IProduct[];
  filteredProducts: IProduct[];
  paymentMethods: IPaymentMethod[];

  dateSelectorSaleByDate: IDateSelector;
  dateSelectorSaleByCategory: IDateSelector;

  chartsResults: IChartsResults;
  chartColorScheme: IChartColorScheme;

  advancedSearchForm: FormGroup;

  salesReportsResControl: ISalesReportsResControl;

  advancesSalesReportColumns: string[] = ['code', 'date', 'customer', 'status', 'totalValue'];
  advancesSalesReportDataSouce = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.advancesSalesReportDataSouce.paginator = paginator;
  }

  constructor(
    private reportApi: ApiReportService,
    private categoryApi: ApiCategoryService,
    private unitApi: ApiUnitService,
    private userApi: ApiUserService,
    private productApi: ApiProductService,
    private paymentMethodApi: ApiPaymentMethodService,
    public utils: UtilsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSalesReportsResControl();
    this.initChartsData();
    this.dateSelectorSaleByDate = { type: 'month', dateRange: this.utils.getMonthRange(this.utils.getCurrentDate()) };
    this.dateSelectorSaleByCategory = { ...this.dateSelectorSaleByDate };
    const query = {
      startDate: this.dateSelectorSaleByDate.dateRange.start.toString(),
      endDate: this.dateSelectorSaleByDate.dateRange.end.toString(),
    };
    forkJoin(
      this.reportApi.getSalesAmountByDateRange(query),
      this.reportApi.getSalesByCatgoryByDateRange(query),
      this.categoryApi.getCategories(),
      this.unitApi.getUnits(),
      this.userApi.getUsers(),
      this.productApi.getProducts(),
      this.paymentMethodApi.getPaymentMethods()
    ).subscribe((res: IHttpRes[]) => {
      const [salesByDateRes, salesByCategoryRes] = res;
      const apiRes = res.slice(2).map((_apiRes) => _apiRes.res);
      [this.categories, this.units, this.sellers, this.products, this.paymentMethods] = apiRes;
      this.filteredProducts = [...this.products];
      this.salesReportsResControl.salesByDate.times.mognodbMongoose = salesByDateRes.time;
      this.salesReportsResControl.salesByCategory.times.mognodbMongoose = salesByCategoryRes.time;
      this.setSalesByDateChartsData(salesByDateRes.res);
      this.setSaleAmountByCategoryChartData(salesByCategoryRes.res);
      this.setSaleTotalByCategoryChartData(salesByCategoryRes.res);
      this.createAdvancedSearchForm();
      this.salesReportsResControl.salesByDate.showChartData = true;
      this.salesReportsResControl.salesByCategory.showChartData = true;
      this.salesReportsResControl.advancedReport.showForm = true;
    });
  }

  initSalesReportsResControl(): void {
    this.salesReportsResControl = {
      salesByDate: {
        showChartData: false,
        times: {},
      },
      salesByCategory: {
        showChartData: false,
        times: {},
      },
      advancedReport: {
        showChartData: false,
        times: {},
        showForm: false,
        requestAttempt: false,
      },
    };
  }

  initChartsData(): void {
    this.chartsResults = {
      salesAmountByDate: [],
      salesTotalByDate: [],
      salesAmountByCategory: [],
      salesTotalByCategory: [],
      advancedSalesReport: [],
    };
  }

  generateChartColorScheme(colorsAmount: number): any {
    return {
      domain: Array(colorsAmount)
        .fill(null)
        .map((_, i) => 'rgba(0, 96, 100, ' + (i + 1) * (1 / colorsAmount) + ')'),
    };
  }

  onDateRangeSaleByDateChange(dateSelector: IDateSelector): void {
    this.salesReportsResControl.salesByDate.showChartData = false;
    this.salesReportsResControl.salesByDate.times.mognodbMongoose = null;
    this.dateSelectorSaleByDate = dateSelector;
    const query = {
      startDate: this.dateSelectorSaleByDate.dateRange.start.toString(),
      endDate: this.dateSelectorSaleByDate.dateRange.end.toString(),
    };
    this.reportApi.getSalesAmountByDateRange(query).subscribe((salesReportRes: IHttpRes) => {
      this.salesReportsResControl.salesByDate.times.mognodbMongoose = salesReportRes.time;
      this.salesReportsResControl.salesByDate.showChartData = true;
      this.setSalesByDateChartsData(salesReportRes.res);
    });
  }

  setSalesByDateChartsData(data: any): void {
    let monthDays: number;
    if (
      this.utils.getMonthName(this.dateSelectorSaleByDate.dateRange.start) ===
        this.utils.getMonthName(this.utils.getCurrentDate()) &&
      this.utils.getFullYear(this.dateSelectorSaleByDate.dateRange.start) ===
        this.utils.getFullYear(this.utils.getCurrentDate())
    ) {
      monthDays = this.utils.getDayNumber(this.utils.getCurrentDate());
    } else {
      monthDays = this.utils.getMonthDaysAmount(this.dateSelectorSaleByDate.dateRange.start);
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
    this.chartsResults.salesAmountByDate = [
      {
        name: this.utils.getMonthName(this.dateSelectorSaleByDate.dateRange.start),
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
    this.chartsResults.salesTotalByDate = [
      {
        name: this.utils.getMonthName(this.dateSelectorSaleByDate.dateRange.start),
        series: salesTotalSeries,
      },
    ];
  }

  onDateRangeSaleByCategoryChange(dateSelector: IDateSelector): void {
    this.salesReportsResControl.salesByCategory.showChartData = false;
    this.salesReportsResControl.salesByCategory.times.mognodbMongoose = null;
    this.dateSelectorSaleByCategory = dateSelector;
    const query = {
      startDate: this.dateSelectorSaleByCategory.dateRange.start.toString(),
      endDate: this.dateSelectorSaleByCategory.dateRange.end.toString(),
    };
    this.reportApi.getSalesByCatgoryByDateRange(query).subscribe((salesReportRes: IHttpRes) => {
      this.salesReportsResControl.salesByCategory.times.mognodbMongoose = salesReportRes.time;
      this.salesReportsResControl.salesByCategory.showChartData = true;
      this.setSalesByCategoryChartsData(salesReportRes.res);
    });
  }

  setSalesByCategoryChartsData(data: any): void {
    this.setSaleAmountByCategoryChartData(data);
    this.setSaleTotalByCategoryChartData(data);
  }

  setSaleAmountByCategoryChartData(data: any): void {
    this.chartsResults.salesAmountByCategory = data.map((info) => {
      return {
        name: info.category,
        value: info.amount,
      };
    });
  }

  setSaleTotalByCategoryChartData(data: any): void {
    this.chartsResults.salesTotalByCategory = data.map((info) => {
      return {
        name: info.category,
        value: info.total,
      };
    });
  }

  createAdvancedSearchForm(): void {
    this.advancedSearchForm = this.fb.group({
      startDate: null,
      endDate: null,
      categories: [],
      units: [],
      products: [],
      paymentMethods: [],
      sellers: [],
    });
  }

  clearAdvancedSearchForm(): void {
    this.advancedSearchForm.setValue({
      startDate: null,
      endDate: null,
      categories: [],
      units: [],
      products: [],
      paymentMethods: [],
      sellers: [],
    });
  }

  onCategoriesChanges(categoriesId: string[]): void {
    categoriesId;
    this.filteredProducts = this.products.filter((product) => {
      const productCategory = <ICategory>product.category;
      return categoriesId.includes(productCategory?._id);
    });
    this.advancedSearchForm.patchValue({
      products: [],
      units: [],
    });
  }

  formatQueryParams(formValue: any): any {
    const formattedQuertParams = {};
    for (const key of Object.keys(formValue)) {
      if (formValue[key]) {
        formattedQuertParams[key] = formValue[key];
      }
    }
    return formattedQuertParams;
  }

  submitAdvancedSearch(): void {
    this.salesReportsResControl.advancedReport.requestAttempt = true;
    this.salesReportsResControl.advancedReport.showChartData = false;
    const queryParams = this.formatQueryParams(this.advancedSearchForm.value);
    this.reportApi.getAdvancesSalesReport(queryParams).subscribe((salesReportRes: IHttpRes) => {
      this.salesReportsResControl.advancedReport.times.mognodbMongoose = salesReportRes.time;
      this.salesReportsResControl.advancedReport.showChartData = true;
      this.chartsResults.advancedSalesReport = salesReportRes.res;
      this.setAdvancedSalesReportDataSource(this.chartsResults.advancedSalesReport);
    });
  }

  get amountAdvancedSalesReport(): number {
    return this.chartsResults.advancedSalesReport?.length;
  }

  get totalAdvancedSalesReport(): number {
    return (
      this.chartsResults.advancedSalesReport?.reduce((totalValue, sale) => (totalValue += sale.totalValue), 0) || 0
    );
  }

  setAdvancedSalesReportDataSource(sales: any[]): void {
    this.advancesSalesReportDataSouce = new MatTableDataSource(sales);
    this.advancesSalesReportDataSouce.paginator = this.paginator;
  }
}
