import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { IUser } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/users`;
    return this.http.get<IHttpRes>(uri);
  }

  getUser(userId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/users/${userId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createUser(user: IUser): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/users/add`;
    return this.http.post<IHttpRes>(uri, user);
  }

  editUser(userId: string, data: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/users/${userId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  toggleBlock(userId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/users/${userId}`;
    return this.http.put<IHttpRes>(uri, {});
  }
}
