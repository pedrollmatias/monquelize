import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  getProducts(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/products');
  }

  // getProduct(productId: string): Observable<IHttpResponse> {
  //   const uri = `products/${productId}`;
  //   return this.http.get<IHttpResponse>(uri);
  // }

  // createProduct(product: IProduct): Observable<IHttpResponse> {
  //   const uri = `products/add`;
  //   return this.http.post<IHttpResponse>(uri, product);
  // }

  // editProduct(productId: string, data: any): Observable<IHttpResponse> {
  //   const uri = `products/${productId}`;
  //   return this.http.post<IHttpResponse>(uri, data);
  // }

  // removeProduct(productId: string): Observable<IHttpResponse> {
  //   const uri = `products/${productId}`;
  //   return this.http.delete<IHttpResponse>(uri);
  // }

  // inventoryAdjustment(productId: string, data: any): Observable<IHttpResponse> {
  //   const uri = `products/${productId}/inventory`;
  //   return this.http.post<IHttpResponse>(uri, data);
  // }
}
