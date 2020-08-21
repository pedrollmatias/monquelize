import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { IHttpRes } from 'src/app/shared/models/http-res.model';
// import { IUnit } from 'src/app/shared/models/views.model';

@Injectable({
  providedIn: 'root',
})
export class ApiUnitService {
  baseUrl = 'http://localhost:9001/api';

  constructor(private http: HttpClient) {}

  // getUnits(): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/units`;
  //   return this.http.get<IHttpRes>(uri);
  // }

  // getUnit(unitId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/units/${unitId}`;
  //   return this.http.get<IHttpRes>(uri);
  // }

  // createUnit(unit: IUnit): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/units/add`;
  //   return this.http.post<IHttpRes>(uri, unit);
  // }

  // editUnit(unitId: string, data: any): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/units/${unitId}`;
  //   return this.http.post<IHttpRes>(uri, data);
  // }

  // removeUnit(unitId: string): Observable<IHttpRes> {
  //   const uri = `${this.baseUrl}/units/${unitId}`;
  //   return this.http.delete<IHttpRes>(uri);
  // }
}
