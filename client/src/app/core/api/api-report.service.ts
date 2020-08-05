import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class ApiReportService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getSalesAmountByDateRange(query: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/reports/get-sales-amount-total-by-date-range`;
    return this.http.get<IHttpRes>(uri, { params: query });
  }

  getSalesByCatgoryByDateRange(query: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/reports/get-sales-by-category-by-date-range`;
    return this.http.get<IHttpRes>(uri, { params: query });
  }
}
