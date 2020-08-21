import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IUser } from 'src/app/shared/models/views.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { ApiUserService } from 'src/app/core/api/api-user.service';

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

  mongodbMongooseTime: number;

  userId: string;
  user: IUser;

  userForm: FormGroup;

  pageTitle = 'Loading...';

  isNewUser: boolean;

  showPageData = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userApi: ApiUserService,
    private sharedComponents: SharedComponentsService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    // this.userId = this.route.snapshot.paramMap.get('id');
    // this.isNewUser = this.userId ? false : true;
    // if (!this.isNewUser) {
    //   this.userApi.getUser(this.userId).subscribe((userRes: IHttpRes) => {
    //     this.user = userRes.res;
    //     this.mongodbMongooseTime = userRes.time;
    //     this.pageTitle = 'Edit user';
    //     this.createUserForm();
    //     this.initFormData(this.user);
    //     this.showPageData = true;
    //   });
    // } else {
    //   this.pageTitle = 'New user';
    //   this.createUserForm();
    //   this.showPageData = true;
    // }
  }

  // createUserForm(): void {
  //   this.userForm = this.fb.group({
  //     username: [{ value: null, disabled: !this.isNewUser }, Validators.required],
  //     email: [null, Validators.email],
  //     firstName: [null, Validators.required],
  //     lastName: [null, Validators.required],
  //     sex: [null, Validators.required],
  //     bornDate: [null, Validators.required],
  //     blocked: [false, Validators.required],
  //   });
  // }

  // initFormData(user: IUser): void {
  //   this.userForm.reset();
  //   this.userForm.patchValue(user);
  // }

  // refreshPage(): void {
  //   this.ngOnInit();
  // }

  // saveUser(): void {
  //   if (this.userForm.invalid) {
  //     this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //   } else {
  //     if (this.isNewUser) {
  //       const user = this.userForm.value;
  //       this.sharedComponents
  //         .openLoadingDialog(this.userApi.createUser(user))
  //         .beforeClosed()
  //         .subscribe((userRes: IHttpRes) => {
  //           this.router.navigate(['/users', 'edit', userRes.res._id]);
  //         });
  //     } else {
  //       const user = this.userForm.value;
  //       this.sharedComponents
  //         .openLoadingDialog(this.userApi.editUser(this.userId, user))
  //         .beforeClosed()
  //         .subscribe((userRes) => {
  //           this.initFormData(userRes.res);
  //         });
  //     }
  //   }
  // }

  // toggleBlockUser(): void {
  //   const dialogTitle = this.user?.blocked ? 'Unlock user' : 'Block user';
  //   const dialogIcon = this.user?.blocked ? 'lock_open' : 'lock';
  //   const msg = '<p>Are you sure you want to block this user?</p>';
  //   this.sharedComponents
  //     .openDialogConfirmation(dialogIcon, 'warn', dialogTitle, msg, dialogTitle)
  //     .beforeClosed()
  //     .pipe(
  //       switchMap((confirmation: IConfirmation) => {
  //         if (confirmation?.confirmed) {
  //           return this.sharedComponents.openLoadingDialog(this.userApi.toggleBlock(this.userId)).beforeClosed();
  //         }
  //         return of();
  //       })
  //     )
  //     .subscribe((res: any) => {
  //       if (res) {
  //         this.router.navigate(['/settings/users']);
  //       }
  //     });
  // }
}
