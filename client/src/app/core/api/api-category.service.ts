import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IPaths } from 'src/app/shared/models/paths.model';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoryService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient, private utils: UtilsService) {}

  getCategories(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/categories');
  }

  getCategory(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createCategory(category: ICategory): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/categories/add', { body: category });
  }

  editCategory(paths: IPaths, category: ICategory): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: category });
  }

  removeCategory(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('DELETE', paths);
  }
}
