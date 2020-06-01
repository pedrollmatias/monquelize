import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ILoader } from 'src/app/shared/models/loader.model';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<ILoader>({ show: false });
  loaderState = this.loaderSubject.asObservable();

  constructor() {}

  show(): void {
    this.loaderSubject.next(<ILoader>{ show: true });
  }

  hide(): void {
    this.loaderSubject.next(<ILoader>{ show: false });
  }
}
