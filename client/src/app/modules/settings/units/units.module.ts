import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsRoutingModule } from './units-routing.module';
import { UnitsComponent } from './pages/units/units.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogUnitDetailsComponent } from './components/dialog-unit-details/dialog-unit-details.component';

@NgModule({
  declarations: [UnitsComponent, DialogUnitDetailsComponent],
  imports: [CommonModule, UnitsRoutingModule, SharedModule],
})
export class UnitsModule {}
