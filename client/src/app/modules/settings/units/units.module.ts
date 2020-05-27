import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsRoutingModule } from './units-routing.module';
import { UnitsComponent } from './pages/units/units.component';
import { UnitDetailsComponent } from './pages/unit-details/unit-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [UnitsComponent, UnitDetailsComponent],
	imports: [CommonModule, UnitsRoutingModule, SharedModule],
})
export class UnitsModule {}
