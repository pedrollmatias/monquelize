import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { ElementLoadingAreaComponent } from './components/element-loading-area/element-loading-area.component';
import { ElementRequestBtnComponent } from './components/element-request-btn/element-request-btn.component';
import { ElementBreadcrumbComponent } from './components/element-breadcrumb/element-breadcrumb.component';
import { ElementFormFieldComponent } from './components/element-form-field/element-form-field.component';
import { ElementCardNoDataFoundComponent } from './components/element-card-no-data-found/element-card-no-data-found.component';
import { ElementButtonIconTextComponent } from './components/element-button-icon-text/element-button-icon-text.component';
import { DialogConfirmationComponent } from './components/dialog-confirmation/dialog-confirmation.component';
import { DialogMessageComponent } from './components/dialog-message/dialog-message.component';
import { SnackbarErrorComponent } from './components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from './components/snackbar-success/snackbar-success.component';
import { SnackbarWarningComponent } from './components/snackbar-warning/snackbar-warning.component';
import { NoSanitizePipe } from './pipes/no-sanitize.pipe';

@NgModule({
  declarations: [
    ElementLoadingAreaComponent,
    ElementRequestBtnComponent,
    ElementBreadcrumbComponent,
    ElementFormFieldComponent,
    ElementCardNoDataFoundComponent,
    ElementButtonIconTextComponent,
    DialogConfirmationComponent,
    DialogMessageComponent,
    SnackbarErrorComponent,
    SnackbarSuccessComponent,
    SnackbarWarningComponent,
    NoSanitizePipe,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ElementLoadingAreaComponent,
    ElementRequestBtnComponent,
    ElementBreadcrumbComponent,
    ElementFormFieldComponent,
    ElementCardNoDataFoundComponent,
    ElementButtonIconTextComponent,
  ],
})
export class SharedModule {}
