import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarWarningComponent } from 'src/app/shared/components/snackbar-warning/snackbar-warning.component';
import { Observable } from 'rxjs';
import { SnackbarErrorComponent } from 'src/app/shared/components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from 'src/app/shared/components/snackbar-success/snackbar-success.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { DialogMessageComponent } from 'src/app/shared/components/dialog-message/dialog-message.component';

@Injectable({
  providedIn: 'root',
})
export class SharedComponentsService {
  constructor(private snackbar: MatSnackBar, public dialog: MatDialog, private zone: NgZone) {}

  openSnackbarError(message: string, duracao?: number) {
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

  openSnackbarSuccess(message: string, duracao?: number) {
    return this.snackbar.openFromComponent(SnackbarSuccessComponent, {
      data: { message: message },
      panelClass: ['bg-primary'],
      duration: duracao || 3000,
    });
  }

  openSnackbarWarning(message: string, duracao?: number) {
    return this.snackbar.openFromComponent(SnackbarWarningComponent, {
      data: { message: message },
      duration: duracao || 3000,
    });
  }

  closeSnackbar() {
    this.snackbar.dismiss();
  }

  openDialogConfirmation(icon: string, iconColor: string, title: string, message: string, btnText?: string) {
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

  openDialogMessage(icon: string, iconColor: string, title: string, message: string, btnText?: string) {
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
}
