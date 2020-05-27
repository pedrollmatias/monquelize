import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';

const routes: Routes = [
	{ path: '', component: CategoriesComponent },
	{ path: 'add', component: CategoryDetailsComponent },
	{ path: 'edit/:id', component: CategoryDetailsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CategoriesRoutingModule {}
