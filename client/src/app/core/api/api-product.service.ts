import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/models/product.model';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/products`;
    return this.http.get<IHttpRes>(uri);
  }

  getProduct(productId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/products/${productId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createProduct(product: IProduct): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/products/create`;
    return this.http.post<IHttpRes>(uri, product);
  }

  editProduct(productId: string, data: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/products/${productId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  removeProduct(productId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/products/${productId}`;
    return this.http.delete<IHttpRes>(uri);
  }
}
