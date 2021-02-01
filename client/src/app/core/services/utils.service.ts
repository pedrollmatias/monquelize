import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import * as dayjs from 'dayjs';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse, IApiRes, IHttpRequest } from 'src/app/shared/models/http.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum BaseUrls {
  MONGODB_MONGOOSE = 'http://localhost:9001/api',
  POSTGRES_SEQUELIZE = 'http://localhost:8001/api',
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private http: HttpClient) {}

  multiRequests(
    httpMethod: keyof typeof HttpMethods,
    paths: IPaths | string,
    options?: any
  ): Observable<IHttpResponse> {
    const requests: IHttpRequest = {
      mongodbMongoose: this.http.request<IApiRes>(
        httpMethod,
        `${BaseUrls.MONGODB_MONGOOSE}${this.isObject(paths) ? (paths as IPaths).mongodbMongoose : paths}`,
        options
      ),
      postgresSequelize: this.http.request<IApiRes>(
        httpMethod,
        `${BaseUrls.POSTGRES_SEQUELIZE}${this.isObject(paths) ? (paths as IPaths).postgresSequelize : paths}`,
        options
      ),
    };
    return forkJoin(requests);
  }

  getEndpointPaths(path: string | IPaths, associatedIds: IAssociatedIds): IPaths {
    return {
      mongodbMongoose: `${!this.isObject(path) ? (path as string) : (path as IPaths).mongodbMongoose}/${
        associatedIds.mongodbMongooseId
      }`,
      postgresSequelize: `${!this.isObject(path) ? (path as string) : (path as IPaths).postgresSequelize}/${
        associatedIds.postgresSequelizeId
      }`,
    };
  }

  setTimes(res: IHttpResponse): IDatabaseTimes {
    return {
      mongodbMongoose: res.mongodbMongoose.time,
      postgresSequelize: res.postgresSequelize.time,
    };
  }

  setGreatestTimes(res: any): IDatabaseTimes {
    const databaseTimes: IDatabaseTimes = { mongodbMongoose: 0, postgresSequelize: 0 };
    return Object.keys(res).reduce((databaseTimes, resKey) => {
      const databaseIds = Object.getOwnPropertyNames(res[resKey]);
      databaseIds.forEach((databaseId) => {
        const resTime = res[resKey][databaseId].time;
        if (resTime > databaseTimes[databaseId]) {
          databaseTimes[databaseId] = resTime;
        }
      });
      return databaseTimes;
    }, databaseTimes);
  }

  resetTimes(): IDatabaseTimes {
    return {
      mongodbMongoose: null,
      postgresSequelize: null,
    };
  }

  splitResponsesByServerId(res: IHttpResponse): any {
    return Object.keys(res).reduce((elements, serverId) => {
      elements[serverId] = res[serverId].res;
      return elements;
    }, {});
  }

  appendAssociatedIdsByUniqueCommonData(
    serversResponseData: IServersResponseData,
    pathSource: string,
    pathTarget?: string
  ): any {
    pathTarget = pathTarget || pathSource;
    return serversResponseData.mongodbMongoose.map((data: any) => {
      const associatedIds: IAssociatedIds = {
        mongodbMongooseId: data._id,
        postgresSequelizeId: serversResponseData.postgresSequelize.find(
          (_data: any) => _data[pathSource] === data[pathTarget]
        )._id,
      };

      return { ...data, associatedIds };
    });
  }

  getFormArrayControl(form: AbstractControl, path: string[]): FormArray {
    return <FormArray>form.get(path);
  }

  round(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }

  getGreatestTime(times: number[]): number {
    return times.reduce((acc, value) => (acc > value ? acc : value));
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getMonthName(date: Date): string {
    return dayjs(date).format('MMMM');
  }

  getFullYear(date: Date): string {
    return date.getFullYear().toString();
  }

  getNextMonth(date: Date): Date {
    return dayjs(date).add(1, 'month').toDate();
  }

  getPreviousMonth(date: Date): Date {
    return dayjs(date).subtract(1, 'month').toDate();
  }

  getMonthRange(date: Date): IDateRange {
    return {
      start: dayjs(date).startOf('month').toDate(),
      end: dayjs(date).endOf('month').toDate(),
    };
  }

  getNextYear(date: Date): Date {
    return dayjs(date).add(1, 'year').toDate();
  }

  getPreviousYear(date: Date): Date {
    return dayjs(date).subtract(1, 'year').toDate();
  }

  getYearRange(date: Date): IDateRange {
    return {
      start: dayjs(date).startOf('year').toDate(),
      end: dayjs(date).endOf('year').toDate(),
    };
  }

  getMonthDaysAmount(date: Date): number {
    return Number(dayjs(date).endOf('month').format('D'));
  }

  getDayNumber(date: Date): number {
    return Number(dayjs(date).format('D'));
  }

  isObject(obj: any) {
    return typeof obj === 'object' && obj !== null;
  }
}
