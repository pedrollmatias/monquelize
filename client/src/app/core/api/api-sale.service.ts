import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class ApiSaleService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  // getSales(query: any = {}): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/sales`;
  //   return this.http.get<IHttpRes>(uri, { params: query });
  // }

  // getSale(saleId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/sales/${saleId}`;
  //   return this.http.get<IHttpRes>(uri);
  // }

  // createSale(sale: any): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/sales/add`;
  //   return this.http.post<IHttpRes>(uri, sale);
  // }

  // editSale(saleId: string, data: any): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/sales/${saleId}`;
  //   return this.http.post<IHttpRes>(uri, data);
  // }

  // removeSale(saleId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/sales/${saleId}`;
  //   return this.http.delete<IHttpRes>(uri);
  // }
}
