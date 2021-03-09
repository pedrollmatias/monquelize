import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IUser } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  constructor(private utils: UtilsService) {}

  getUsers(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/users');
  }

  getUser(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', paths);
  }

  createUser(user: IUser): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/users/add', { body: user });
  }

  editUser(paths: IPaths, user: IUser): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', paths, { body: user });
  }

  toggleBlock(paths: IPaths): Observable<IHttpResponse> {
    return this.utils.multiRequests('PUT', paths);
  }
}
