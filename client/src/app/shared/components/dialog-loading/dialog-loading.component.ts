import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDatabaseTimes } from '../../models/database-times';
import { IHttpResponse } from '../../models/http.model';

declare interface IDialogLoading {
  httpResponse$: Observable<IHttpResponse>;
}

@Component({
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.scss'],
})
export class DialogLoadingComponent implements OnInit {
  httpResponse$: Observable<IHttpResponse>;

  databaseTimes: IDatabaseTimes;
  httpResponse: IHttpResponse;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogLoading,
    public dialogRef: MatDialogRef<DialogLoadingComponent>,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.httpResponse$ = this.data.httpResponse$;
    this.httpResponse$.subscribe((res: IHttpResponse) => {
      this.httpResponse = res;
      this.databaseTimes = this.utils.setTimes(res);
    });
  }

  closeDialog(): void {
    this.dialogRef.close(this.httpResponse);
  }
}
