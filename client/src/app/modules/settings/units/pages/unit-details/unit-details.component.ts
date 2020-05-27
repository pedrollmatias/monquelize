import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-unit-details',
	templateUrl: './unit-details.component.html',
	styleUrls: ['./unit-details.component.scss'],
})
export class UnitDetailsComponent implements OnInit {
	breadcrumb: IBreadcrumb = [
		{ label: 'Settings', path: '/settings', isLink: true },
		{ label: 'Units', path: '/settings/units', isLink: true },
	];
	pageTitle: string;
	unitForm: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.pageTitle = 'New unit';
		this.createUnitForm();
	}

	createUnitForm(): void {
		this.unitForm = this.fb.group({
			unit: [null, Validators.required],
			shortUnit: [null, Validators.required],
			decimalPlaces: null,
		});
	}
}
