import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedComponentsService } from '../services/shared-components.service';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(err: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const sharedComponents = this.injector.get(SharedComponentsService);

    let message: string;
    if (err instanceof HttpErrorResponse) {
      message = errorService.getServerMessage(err);
      sharedComponents.openSnackbarError(message);
    } else {
      message = errorService.getClientMessage(err);
      sharedComponents.openSnackbarError(message);
    }
    console.error(err);
  }
}
