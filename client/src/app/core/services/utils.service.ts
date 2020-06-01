import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

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
}
