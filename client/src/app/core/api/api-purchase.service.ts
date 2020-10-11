import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IPurchase } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPurchaseService {
  constructor(private utils: UtilsService) {}

  getPurchases(query: any = {}): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/purchases', { params: query });
  }

  getPurchase(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createPurchase(purchase: IPurchase): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/purchases/add', { body: purchase });
  }

  editPurchase(paths: IPaths, purchase: IPurchase): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: purchase });
  }

  removePurchase(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('DELETE', paths);
  }
}
