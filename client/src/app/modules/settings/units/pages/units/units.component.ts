import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IUnit } from 'src/app/shared/models/views.model';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { DialogUnitDetailsComponent } from '../../components/dialog-unit-details/dialog-unit-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

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

  units: IUnit[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private unitApi: ApiUnitService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.unitApi.getUnits().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.units = this.getUnits(res);
      this.setDataSource(this.units);
    });
  }

  getUnits(res: IHttpResponse): IUnit[] {
    const unitsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(unitsByServer, 'name');
  }

  setDataSource(units: IUnit[]): void {
    this.unitsDataSource = new MatTableDataSource(units);
    this.unitsDataSource.paginator = this.paginator;
  }

  navigateToEditUnit(unit: IUnit): void {
    const params = {
      ...(unit.associatedIds.postgresSequelizeId && {
        postgresSequelize: unit.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', unit._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.units = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }

  openUnitDetailsDialog(associatedIds?: IAssociatedIds): void {
    const unitDetailsDialogRef = this.dialog.open(DialogUnitDetailsComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        units: this.units,
        associatedIds: associatedIds,
      },
    });

    unitDetailsDialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.resetData();
            return this.unitApi.getUnits();
          }
          return of(null);
        }),
        map((res) => (res ? { confirmed: true, res } : { confirmed: false }))
      )
      .subscribe(({ confirmed, res }: { confirmed: Boolean; res?: IHttpResponse }) => {
        if (confirmed) {
          this.databaseTimes = this.utils.setTimes(res);
          this.units = this.getUnits(res);
          this.setDataSource(this.units);
        }
      });
  }
}
