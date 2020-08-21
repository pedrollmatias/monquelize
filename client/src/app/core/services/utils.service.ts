import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import * as dayjs from 'dayjs';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse, IApiRes, IHttpRequest } from 'src/app/shared/models/http.model';

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

  multiRequests(httpMethod: keyof typeof HttpMethods, path: string, options?: any): Observable<IHttpResponse> {
    const requests: IHttpRequest = {
      mongodbMongoose: this.http.request<IApiRes>(httpMethod, `${BaseUrls.MONGODB_MONGOOSE}${path}`, options),
      postgresSequelize: this.http.request<IApiRes>(httpMethod, `${BaseUrls.POSTGRES_SEQUELIZE}${path}`, options),
    };
    return forkJoin(requests);
  }

  setTimes({
    postgres,
    postgresSequelize,
    mongodb,
    mongodbMongoose,
  }: {
    postgres?: number;
    postgresSequelize?: number;
    mongodb?: number;
    mongodbMongoose?: number;
  }): IDatabaseTimes {
    return {
      mongodbMongoose,
      mongodb,
      postgres,
      postgresSequelize,
    };
  }

  resetTimes(): IDatabaseTimes {
    return {
      mongodbMongoose: null,
      mongodb: null,
      postgres: null,
      postgresSequelize: null,
    };
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
}
