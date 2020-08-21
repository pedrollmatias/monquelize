import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IUnit } from 'src/app/shared/models/views.model';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { DialogUnitDetailsComponent } from '../../components/dialog-unit-details/dialog-unit-details.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.unitsDataSource.paginator = paginator;
  }

  unitsColumns: string[] = ['unit', 'shortUnit', 'decimalPlaces'];
  unitsDataSource = new MatTableDataSource<IUnit>();

  constructor(private unitApi: ApiUnitService, private dialog: MatDialog) {}

  units: IUnit[];

  mongodbMongooseTime: number;

  ngOnInit(): void {
    // this.resetData();
    // this.unitApi.getUnits().subscribe((unitRes) => {
    //   this.units = <IUnit[]>unitRes.res;
    //   this.mongodbMongooseTime = unitRes.time;
    //   this.setDataSource(this.units);
    // });
  }

  // setDataSource(units: IUnit[]): void {
  //   this.unitsDataSource = new MatTableDataSource(units);
  //   this.unitsDataSource.paginator = this.paginator;
  // }

  // resetData(): void {
  //   this.mongodbMongooseTime = null;
  //   this.units = undefined;
  // }

  // refreshComponent(): void {
  //   this.ngOnInit();
  // }

  // openUnitDetailsDialog(unitId: string = null): void {
  //   const unitDetailsDialogRef = this.dialog.open(DialogUnitDetailsComponent, {
  //     autoFocus: false,
  //     restoreFocus: false,
  //     width: '70vw',
  //     data: {
  //       units: this.units,
  //       unitId: unitId,
  //     },
  //   });

  //   unitDetailsDialogRef
  //     .beforeClosed()
  //     .pipe(
  //       switchMap((confirmed) => {
  //         if (confirmed) {
  //           this.resetData();
  //           return this.unitApi.getUnits();
  //         } else {
  //           const unitRes: IHttpRes = { res: this.units, time: this.mongodbMongooseTime };
  //           return of(unitRes);
  //         }
  //       })
  //     )
  //     .subscribe((unitRes: IHttpRes) => {
  //       this.units = <IUnit[]>unitRes.res;
  //       this.mongodbMongooseTime = unitRes.time;
  //       this.setDataSource(this.units);
  //     });
  // }
}
