import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';

@NgModule({
  declarations: [CategoriesComponent, CategoryDetailsComponent],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
