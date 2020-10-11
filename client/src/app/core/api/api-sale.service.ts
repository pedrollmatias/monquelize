import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { ISale } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiSaleService {
  constructor(private utils: UtilsService) {}

  getSales(query: any = {}): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/sales', { params: query });
  }

  getSale(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createSale(sale: ISale): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/sales/add', { body: sale });
  }

  editSale(paths: IPaths, sale: ISale): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: sale });
  }

  removeSale(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('DELETE', paths);
  }
}
