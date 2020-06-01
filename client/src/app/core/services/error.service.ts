import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  getClientMessage(err: any): string {
    if (!navigator.onLine) {
      return 'No internet';
    }
    return err.message;
  }

  getClientStack(err: Error): string {
    return err.stack;
  }

  getServerMessage(err: HttpErrorResponse): string {
    return err.error || err.message;
  }

  getServerStack(err: HttpErrorResponse): string {
    // handle stack trace
    return 'stack';
  }
}
