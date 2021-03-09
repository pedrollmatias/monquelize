import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { BaseUrls } from 'src/app/shared/enums/base-urls.enum';
import { HttpMethods } from 'src/app/shared/enums/http-methods.enum';
import { IApiRes, IHttpRequest, IHttpResponse } from 'src/app/shared/models/http.model';
import { UtilsService } from '../services/utils.service';

declare interface IQuery {
  postgresSequelize: any;
  mongodbMongoose: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiReportService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  getSalesAmountTotalByDateRange(query: any): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/reports/get-sales-amount-total-by-date-range', { params: query });
  }

  getSalesProductsByCategoryByDateRange(query: any): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/reports/get-sales-products-by-category-by-date-range', { params: query });
  }

  getAdvancedSalesReport(query: IQuery): Observable<IHttpResponse> {
    const requests: IHttpRequest = {
      mongodbMongoose: this.http.request<HttpEvent<IApiRes>>(
        HttpMethods.GET,
        `${BaseUrls.MONGODB_MONGOOSE}/reports/get-advanced-sales-report`,
        {
          params: query.mongodbMongoose || {},
        }
      ),
      postgresSequelize: this.http.request<HttpEvent<IApiRes>>(
        HttpMethods.GET,
        `${BaseUrls.POSTGRES_SEQUELIZE}/reports/get-advanced-sales-report`,
        {
          params: query.postgresSequelize || {},
        }
      ),
    };
    return forkJoin(requests);
  }

  // buildObjParams(query: IQuery): HttpParams {
  //   let httpParams = new HttpParams();

  //   for (const server of Object.keys(query)) {
  //     for (const key of Object.keys(query[server])) {
  //       for (const element of key) {
  //         httpParams = httpParams.append(`${server}.${key}[]`, element);
  //       }
  //     }
  //   }

  //   return httpParams;
  // }
}
