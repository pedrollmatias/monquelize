import { Injectable } from '@angular/core';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiPurchaseService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getPurchases(): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/purchases`;
    return this.http.get<IHttpRes>(uri);
  }

  getPurchase(purchaseId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/purchases/${purchaseId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createPurchase(purchase: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/purchases/add`;
    return this.http.post<IHttpRes>(uri, purchase);
  }

  editPurchase(purchaseId: string, data: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/purchases/${purchaseId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  removePurchase(purchaseId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/purchases/${purchaseId}`;
    return this.http.delete<IHttpRes>(uri);
  }
}
