import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/models/category.model';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoryService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  getCategories(query?: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/categories`;
    return this.http.get<IHttpRes>(uri, { params: query });
  }

  getCategory(categoryId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/categories/${categoryId}`;
    return this.http.get<IHttpRes>(uri);
  }

  createCategory(category: ICategory): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/categories/create`;
    return this.http.post<IHttpRes>(uri, category);
  }

  editCategory(categoryId: string, data: any): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/categories/${categoryId}`;
    return this.http.post<IHttpRes>(uri, data);
  }

  removeCategory(categoryId: string): Observable<IHttpRes> {
    const uri = `${this.baseUrl}/categories/${categoryId}`;
    return this.http.delete<IHttpRes>(uri);
  }
}
