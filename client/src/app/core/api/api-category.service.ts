import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/models/views.model';
import { UtilsService } from '../services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoryService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient, private utils: UtilsService) {}

  getCategories(): Observable<IHttpResponse> {
    return this.utils.multiRequests('GET', '/categories');
  }

  // getCategory(categoryId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/categories/${categoryId}`;
  //   return this.http.get<IHttpRes>(uri);
  // }

  createCategory(category: ICategory): Observable<IHttpResponse> {
    return this.utils.multiRequests('POST', '/categories/add', { body: category });
  }

  // createCategory(category: ICategory): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/categories/add`;
  //   return this.http.post<IHttpRes>(uri, category);
  // }

  // editCategory(categoryId: string, data: any): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/categories/${categoryId}`;
  //   return this.http.post<IHttpRes>(uri, data);
  // }

  // removeCategory(categoryId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/categories/${categoryId}`;
  //   return this.http.delete<IHttpRes>(uri);
  // }
}
