import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/views.model';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPaymentMethodService {
  constructor(private utils: UtilsService) {}

  getPaymentMethods(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/payment-methods');
  }

  getPaymentMethod(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createPaymentMethod(paymentMethod: IPaymentMethod): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/payment-methods/add', { body: paymentMethod });
  }

  editPaymentMethod(paths: IPaths, paymentMethod: IPaymentMethod): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: paymentMethod });
  }

  removePaymentMethod(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('DELETE', paths);
  }
}
