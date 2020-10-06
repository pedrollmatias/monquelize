import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUnit } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';

@Injectable({
  providedIn: 'root',
})
export class ApiUnitService {
  constructor(private utils: UtilsService) {}

  getUnits(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/units');
  }

  getUnit(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createUnit(unit: IUnit): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/units/add', { body: unit });
  }

  editUnit(paths: IPaths, unit: IUnit): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: unit });
  }

  removeUnit(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('DELETE', paths);
  }
}
