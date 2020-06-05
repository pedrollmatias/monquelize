import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmation } from '../../models/confirmation.model';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss'],
})
export class DialogConfirmationComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  closeDialog(confirmed: boolean): void {
    const confirmation: IConfirmation = { confirmed: confirmed };
    this.dialogRef.close(confirmation);
  }
}
