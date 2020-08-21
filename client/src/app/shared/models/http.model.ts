import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

export interface IHttpRequest {
  mongodbMongoose: Observable<HttpEvent<IApiRes>>;
  postgresSequelize: Observable<HttpEvent<IApiRes>>;
}

export interface IHttpResponse {
  mongodbMongoose: IApiRes;
  postgresSequelize: IApiRes;
}

export interface IApiRes {
  res: any;
  time: number;
}
