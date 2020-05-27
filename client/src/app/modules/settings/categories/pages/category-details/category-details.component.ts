import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-category-details',
	templateUrl: './category-details.component.html',
	styleUrls: ['./category-details.component.scss'],
})
export class CategoryDetailsComponent implements OnInit {
	breadcrumb: IBreadcrumb = [
		{ label: 'Settings', path: '/settings', isLink: true },
		{ label: 'Categories', path: '/settings/categories', isLink: true },
	];
	pageTitle: string;
	categoryForm: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.pageTitle = 'New category';
		this.createCategoryForm();
	}

	createCategoryForm(): void {
		this.categoryForm = this.fb.group({
			name: [null, Validators.required],
			parent: [null, Validators.required],
		});
	}
}
