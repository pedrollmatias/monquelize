import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitsComponent } from './pages/units/units.component';
import { UnitDetailsComponent } from './pages/unit-details/unit-details.component';

const routes: Routes = [
	{ path: '', component: UnitsComponent },
	{ path: 'add', component: UnitDetailsComponent },
	{ path: 'edit/:id', component: UnitDetailsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UnitsRoutingModule {}
