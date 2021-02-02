import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInventoryMovement, IProduct } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';

@Injectable({
  providedIn: 'root',
})
export class ApiInventoryService {
  constructor(private utils: UtilsService) {}

  getProductInventory(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  addInventoryMovement(paths: IPaths, movement: IInventoryMovement): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: movement });
  }

  adjustProductInventory(paths: IPaths, movement: IInventoryMovement): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: movement });
  }
}
