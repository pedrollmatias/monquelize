import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IBreadcrumb, IItemBreadcrumb } from '../../models/breadcrumb.model';

@Component({
	selector: 'app-element-breadcrumb',
	templateUrl: './element-breadcrumb.component.html',
	styleUrls: ['./element-breadcrumb.component.scss'],
})
export class ElementBreadcrumbComponent implements OnInit {
	@Input() breadcrumb: IBreadcrumb;

	constructor(private router: Router) {}

	ngOnInit() {}

	navigateToRoute(breadcrumbItem: IItemBreadcrumb): void {
		if (breadcrumbItem.isLink) {
			this.router.navigateByUrl(breadcrumbItem.path);
		}
	}
}
