import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWarningComponent } from 'src/app/shared/components/snackbar-warning/snackbar-warning.component';
import { Observable } from 'rxjs';
import { SnackbarErrorComponent } from 'src/app/shared/components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from 'src/app/shared/components/snackbar-success/snackbar-success.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { DialogMessageComponent } from 'src/app/shared/components/dialog-message/dialog-message.component';
import { DialogLoadingComponent } from 'src/app/shared/components/dialog-loading/dialog-loading.component';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

@Injectable({
  providedIn: 'root',
})
export class SharedComponentsService {
  constructor(private snackbar: MatSnackBar, public dialog: MatDialog, private zone: NgZone) {}

  openSnackbarError(message: string, duracao?: number): void {
    this.zone.run(() => {
      setTimeout(() => {
        return this.snackbar.openFromComponent(SnackbarErrorComponent, {
          data: { message: message },
          panelClass: ['bg-warn'],
          duration: duracao || 3000,
        });
      });
    });
  }

  openSnackbarSuccess(message: string, duracao?: number): MatSnackBarRef<SnackbarSuccessComponent> {
    return this.snackbar.openFromComponent(SnackbarSuccessComponent, {
      data: { message: message },
      panelClass: ['bg-primary'],
      duration: duracao || 3000,
    });
  }

  openSnackbarWarning(message: string, duracao?: number): MatSnackBarRef<SnackbarWarningComponent> {
    return this.snackbar.openFromComponent(SnackbarWarningComponent, {
      data: { message: message },
      duration: duracao || 3000,
    });
  }

  closeSnackbar(): void {
    this.snackbar.dismiss();
  }

  openDialogConfirmation(
    icon: string,
    iconColor: string,
    title: string,
    message: string,
    btnText?: string
  ): MatDialogRef<DialogConfirmationComponent> {
    return this.dialog.open(DialogConfirmationComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '35vw',
      maxHeight: '90vh',
      data: {
        icon: icon,
        iconColor: iconColor,
        title: title,
        message: message,
        btnText: btnText,
      },
    });
  }

  openDialogMessage(
    icon: string,
    iconColor: string,
    title: string,
    message: string,
    btnText?: string
  ): MatDialogRef<DialogMessageComponent> {
    return this.dialog.open(DialogMessageComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '35vw',
      maxHeight: '90vh',
      data: {
        icon: icon,
        iconColor: iconColor,
        title: title,
        message: message,
        btnText: btnText,
      },
    });
  }

  openLoadingDialog(httpRequest: Observable<IHttpRes>): MatDialogRef<DialogLoadingComponent> {
    return this.dialog.open(DialogLoadingComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        httpRequest: httpRequest,
      },
    });
  }
}
