import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IUser } from 'src/app/shared/models/views.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [
    { label: 'Settings', path: 'settings', isLink: true },
    { label: 'Users', path: 'settings/users', isLink: true },
  ];

  databaseTimes: IDatabaseTimes;

  userId: string;
  associatedIds: IAssociatedIds;
  user: IUser;

  endpointPaths: IPaths;

  userForm: FormGroup;

  pageTitle = 'Loading...';

  isNewUser: boolean;

  showPageData = false;
  showLoadingArea = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userApi: ApiUserService,
    private sharedComponents: SharedComponentsService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isNewUser = this.userId ? false : true;
    if (!this.isNewUser) {
      this.showLoadingArea = true;
      this.route.params
        .pipe(
          switchMap((params) => {
            this.associatedIds = this.getAssociatedIds(params);
            this.endpointPaths = this.utils.getEndpointPaths('/users', this.associatedIds);
            return this.userApi.getUser(this.endpointPaths);
          })
        )
        .subscribe((res: IHttpResponse) => {
          this.databaseTimes = this.utils.setTimes(res);
          this.user = this.getUser(res);
          this.pageTitle = 'Edit user';
          this.createUserForm();
          this.initFormData(this.user);
          this.showPageData = true;
        });
    } else {
      this.pageTitle = 'New user';
      this.createUserForm();
      this.showPageData = true;
    }
  }

  getAssociatedIds(params: Params): IAssociatedIds {
    return { mongodbMongooseId: params.id, postgresSequelizeId: params.postgresSequelize };
  }

  getUser(res: IHttpResponse): IUser {
    const { mongodbMongoose } = res;
    return { ...mongodbMongoose.res, associatedIds: this.associatedIds };
  }

  createUserForm(): void {
    this.userForm = this.fb.group({
      username: [{ value: null, disabled: !this.isNewUser }, Validators.required],
      email: [null, Validators.email],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      sex: [null, Validators.required],
      bornDate: [null, Validators.required],
      blocked: [false, Validators.required],
    });
  }

  initFormData(user: IUser): void {
    this.userForm.reset();
    this.userForm.patchValue(user);
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else if (this.isNewUser) {
      const user = this.userForm.value;
      this.sharedComponents
        .openLoadingDialog(this.userApi.createUser(user))
        .beforeClosed()
        .subscribe((res: IHttpResponse) => {
          const params = {
            postgresSequelize: res.postgresSequelize.res._id,
          };
          this.router.navigate(['/users', 'edit', res.mongodbMongoose.res._id, params]);
        });
    } else {
      const user = this.userForm.value;
      this.sharedComponents
        .openLoadingDialog(this.userApi.editUser(this.endpointPaths, user))
        .beforeClosed()
        .subscribe((res: IHttpResponse) => {
          this.user = this.getUser(res);
          this.initFormData(this.user);
        });
    }
  }

  toggleBlockUser(): void {
    const dialogTitle = this.user?.blocked ? 'Unlock user' : 'Block user';
    const dialogIcon = this.user?.blocked ? 'lock_open' : 'lock';
    const msg = '<p>Are you sure you want to block this user?</p>';
    this.sharedComponents
      .openDialogConfirmation(dialogIcon, 'warn', dialogTitle, msg, dialogTitle)
      .beforeClosed()
      .pipe(
        switchMap((confirmation: IConfirmation) => {
          if (confirmation?.confirmed) {
            return this.sharedComponents.openLoadingDialog(this.userApi.toggleBlock(this.endpointPaths)).beforeClosed();
          }
          return of();
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/settings/users']);
        }
      });
  }
}
