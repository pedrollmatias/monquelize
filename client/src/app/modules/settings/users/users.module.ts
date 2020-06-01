import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

@NgModule({
	declarations: [UsersComponent, UserDetailsComponent],
	imports: [CommonModule, UsersRoutingModule, SharedModule],
})
export class UsersModule {}
