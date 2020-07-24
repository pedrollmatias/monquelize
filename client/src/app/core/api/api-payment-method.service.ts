import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { IPaymentMethod } from 'src/app/shared/models/payment-method.model';

@Injectable({
  providedIn: 'root',
})
export class ApiPaymentMethodService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/payment-methods`;
    return this.http.get<IHttpRes>(uri);
  }

  getPaymentMethod(paymentMethodId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/payment-methods/${paymentMethodId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createPaymentMethod(paymentMethod: IPaymentMethod): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/payment-methods/add`;
    return this.http.post<IHttpRes>(uri, paymentMethod);
  }

  editPaymentMethod(paymentMethodId: string, data: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/payment-methods/${paymentMethodId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  removePaymentMethod(paymentMethodId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/payment-methods/${paymentMethodId}`;
    return this.http.delete<IHttpRes>(uri);
  }
}
