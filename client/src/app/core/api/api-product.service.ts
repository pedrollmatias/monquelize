import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ApiProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    const uri = 'http://localhost:9001/api/products';
    return this.http.get<IProduct[]>(uri);
  }
}
