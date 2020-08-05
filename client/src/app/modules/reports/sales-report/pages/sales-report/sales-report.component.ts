import { Component, OnInit } from '@angular/core';
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

declare interface ISalesReportResControl {
  showChartData: boolean;
  times: any;
}

declare interface IChartsResults {
  salesAmountByDate: any;
  salesTotalByDate: any;
  salesAmountByCategory: any;
  salesTotalByCategory: any;
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
  paymentMethods: IPaymentMethod[];

  dateSelectorSaleByDate: IDateSelector;

  chartsResults: IChartsResults;

  advancedSearchForm: FormGroup;

  salesReportsResControl: ISalesReportsResControl;

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
      this.salesReportsResControl.salesByDate.times.mognodbMongoose = salesByDateRes.time;
      this.salesReportsResControl.salesByCategory.times.mognodbMongoose = salesByCategoryRes.time;
      this.setSalesByDateChartsData(salesByDateRes.res);
      this.setSaleAmountByCategoryChartData(salesByCategoryRes.res);
      this.setSaleTotalByCategoryChartData(salesByCategoryRes.res);
      this.createAdvancedSearchForm();
      this.salesReportsResControl.salesByDate.showChartData = true;
      this.salesReportsResControl.salesByCategory.showChartData = true;
      this.salesReportsResControl.advancedReport.showChartData = true;
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
      },
    };
  }

  initChartsData(): void {
    this.chartsResults = {
      salesAmountByDate: [],
      salesTotalByDate: [],
      salesAmountByCategory: [],
      salesTotalByCategory: [],
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
      categories: null,
      units: null,
      products: null,
      paymenthMethods: null,
      sellers: null,
    });
  }
}
