import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/models/product.model';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductService {
  constructor(private http: HttpClient) {}

  getProducts(baseUrl: string): Observable<IHttpRes> {
    const uri = `${baseUrl}/products`;
    return this.http.get<IHttpRes>(uri);
  }

  getProduct(baseUrl: string, productId: string): Observable<IHttpRes> {
    const uri = `${baseUrl}/products/${productId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createProduct(baseUrl: string, product: IProduct): Observable<IHttpRes> {
    const uri = `${baseUrl}/products/add`;
    return this.http.post<IHttpRes>(uri, product);
  }

  editProduct(baseUrl: string, productId: string, data: any): Observable<IHttpRes> {
    const uri = `${baseUrl}/products/${productId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  removeProduct(baseUrl: string, productId: string): Observable<IHttpRes> {
    const uri = `${baseUrl}/products/${productId}`;
    return this.http.delete<IHttpRes>(uri);
  }

  inventoryAdjustment(baseUrl: string, productId: string, data: any): Observable<IHttpRes> {
    const uri = `${baseUrl}/products/${productId}/inventory`;
    return this.http.post<IHttpRes>(uri, data);
  }
}
