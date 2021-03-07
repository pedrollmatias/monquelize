import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiReportService {
  constructor(private utils: UtilsService) {}

  getSalesAmountByDateRange(query: any): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/reports/get-sales-amount-total-by-date-range', { params: query });
  }
}
