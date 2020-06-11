import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class ServerInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loaderService = this.injector.get(LoaderService);
    loaderService.show();

    request = request.clone();

    return next.handle(request).pipe(
      finalize(() => loaderService.hide()),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
