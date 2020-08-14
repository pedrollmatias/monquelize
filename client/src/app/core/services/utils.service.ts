import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import * as dayjs from 'dayjs';
import { IDateRange } from 'src/app/shared/models/date-range.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public get postgresSequelizeBaseUrl(): string {
    return 'http://localhost:8001/api';
  }

  public get mongodbMongooseBaseUrl(): string {
    return 'http://localhost:9001/api';
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
