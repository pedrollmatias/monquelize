import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiReportService } from 'src/app/core/api/api-report.service';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';
import { ICategory, IPaymentMethod, IProduct, ISale, IUnit, IUser } from 'src/app/shared/models/views.model';

declare interface ICardsResult {
  total: number;
  amount: number;
}

declare interface IHttpResponsesObj {
  categories: IHttpResponse;
  paymentMethods: IHttpResponse;
  products: IHttpResponse;
  units: IHttpResponse;
  users: IHttpResponse;
}

@Component({
  selector: 'app-element-advanced-sales-reports',
  templateUrl: './element-advanced-sales-reports.component.html',
  styleUrls: ['./element-advanced-sales-reports.component.scss'],
})
export class ElementAdvancedSalesReportsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  databaseTimes: IDatabaseTimes;

  categories: ICategory[];
  units: IUnit[];
  sellers: IUser[];
  products: IProduct[];
  filteredProducts: IProduct[];
  paymentMethods: IPaymentMethod[];

  advancesSalesReportColumns: string[] = ['code', 'date', 'customer', 'totalValue', 'seller'];
  advancesSalesReportDataSouce = new MatTableDataSource<IProduct>();

  advancedSearchForm: FormGroup;

  report: any;
  cardsResult: ICardsResult;

  showForm = false;
  requestAttempt = false;
  showResult = false;

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.advancesSalesReportDataSouce.paginator = paginator;
  }

  constructor(
    private categoryApi: ApiCategoryService,
    private fb: FormBuilder,
    private unitApi: ApiUnitService,
    private userApi: ApiUserService,
    private productApi: ApiProductService,
    private paymentMethodApi: ApiPaymentMethodService,
    public utils: UtilsService,
    private reportApi: ApiReportService
  ) {}

  ngOnInit(): void {
    forkJoin({
      categories: this.categoryApi.getCategories(),
      units: this.unitApi.getUnits(),
      users: this.userApi.getUsers(),
      products: this.productApi.getProducts(),
      paymentMethods: this.paymentMethodApi.getPaymentMethods(),
    }).subscribe((res: IHttpResponsesObj) => {
      this.setData(res);
      this.filteredProducts = [...this.products];
      this.createAdvancedSearchForm();
      this.showForm = true;
    });
  }

  setData(res: IHttpResponsesObj): void {
    this.categories = this.getCategories(res.categories);
    this.units = this.getUnits(res.units);
    this.sellers = this.getUsers(res.users);
    this.products = this.getProducts(res.products);
    this.paymentMethods = this.getPaymentMethods(res.paymentMethods);
  }

  getCategories(res: IHttpResponse): ICategory[] {
    const categoriesByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(categoriesByServer, 'path');
  }

  getUnits(res: IHttpResponse): IUnit[] {
    const unitsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(unitsByServer, 'unit');
  }

  getProducts(res: IHttpResponse): IProduct[] {
    const productByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(productByServer, 'sku');
  }

  getPaymentMethods(res: IHttpResponse): IPaymentMethod[] {
    const paymentMethodsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(paymentMethodsByServer, 'name');
  }

  getUsers(res: IHttpResponse): IUser[] {
    const usersByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(usersByServer, 'username');
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

  onCategoriesChanges(categories: ICategory[]): void {
    const _categoriesIds = categories.map((category) => category._id);
    this.filteredProducts = this.products.filter((product) => {
      const productCategory = <ICategory>product.category;
      return _categoriesIds.includes(productCategory?._id);
    });
    this.advancedSearchForm.patchValue({
      products: [],
      units: [],
    });
  }

  formatQueryParams(formValue: any): any {
    return Object.keys(formValue).reduce(
      (queryParamsByServer, key) => {
        const isArray = Array.isArray(formValue[key]);
        if (formValue[key] && (!isArray || (isArray && formValue[key]?.length))) {
          queryParamsByServer.mongodbMongoose[key] = isArray
            ? formValue[key].map((element) => element.associatedIds.mongodbMongooseId)
            : formValue[key];
          queryParamsByServer.postgresSequelize[key] = isArray
            ? formValue[key].map((element) => element.associatedIds.postgresSequelizeId)
            : formValue[key];
        }

        return queryParamsByServer;
      },
      { mongodbMongoose: {}, postgresSequelize: {} }
    );
  }

  submitAdvancedSearch(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.requestAttempt = true;
    this.showResult = false;
    const queryParams = this.formatQueryParams(this.advancedSearchForm.value);
    this.reportApi.getAdvancedSalesReport(queryParams).subscribe((res: IHttpResponse) => {
      this.report = res.mongodbMongoose?.res;
      this.databaseTimes = this.utils.setTimes(res);
      this.showResult = true;
      this.cardsResult = {
        total: this.report?.reduce((total: number, sale) => (total += sale.totalValue), 0),
        amount: this.report?.length,
      };
      this.setAdvancedSalesReportDataSource(this.report);
    });
  }

  setAdvancedSalesReportDataSource(sales: any[]): void {
    this.advancesSalesReportDataSouce = new MatTableDataSource(sales);
    this.advancesSalesReportDataSouce.paginator = this.paginator;
  }
}
