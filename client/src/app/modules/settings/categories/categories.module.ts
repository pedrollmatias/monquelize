import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogCategoryDetailsComponent } from './components/dialog-category-details/dialog-category-details.component';

@NgModule({
  declarations: [CategoriesComponent, DialogCategoryDetailsComponent],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
