import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import * as dayjs from 'dayjs';
import { IDateRange } from 'src/app/shared/models/date-range.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  getFormArrayControl(form: AbstractControl, path: string[]): FormArray {
    return <FormArray>form.get(path);
  }

  round(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }

  getGreatestTime(times: number[]) {
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
}
