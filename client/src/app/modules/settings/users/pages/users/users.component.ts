import { Component, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { IUser } from 'src/app/shared/models/views.model';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.usersDataSource.paginator = paginator;
  }

  usersColumns: string[] = ['fullName', 'username', 'email', 'blocked'];
  usersDataSource = new MatTableDataSource<IUser>();

  users: IUser[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private userApi: ApiUserService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.userApi.getUsers().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.users = this.getUsers(res);
      this.setDataSource(this.users);
    });
  }

  getUsers(res: IHttpResponse): IUser[] {
    const usersByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(usersByServer, 'username');
  }

  setDataSource(users: IUser[]): void {
    this.usersDataSource = new MatTableDataSource(users);
    this.usersDataSource.paginator = this.paginator;
  }

  navigateToEditUser(user: IUser): void {
    const params = {
      ...(user.associatedIds.postgresSequelizeId && {
        postgresSequelize: user.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate(['edit', user._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.users = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }
}
