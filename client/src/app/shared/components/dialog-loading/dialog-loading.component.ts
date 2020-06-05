import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IHttpRes } from '../../models/http-res.model';

@Component({
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.scss'],
})
export class DialogLoadingComponent implements OnInit {
  httpRequest: Observable<IHttpRes>;

  httpRes: any;
  mongodbMongooseTime: number;

  constructor(public dialogRef: MatDialogRef<DialogLoadingComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.data.httpRequest.subscribe((httpRes: IHttpRes) => {
      this.httpRes = httpRes;
      this.mongodbMongooseTime = httpRes.time;
    });
  }

  closeDialog(): void {
    this.dialogRef.close(this.httpRes);
  }
}
