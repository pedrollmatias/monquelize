import { Component, OnInit } from '@angular/core';

declare interface ISettingItem {
	icon: string;
	label: string;
	path: string;
}

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
	settingItems: ISettingItem[] = [
		// {
		// 	icon: 'people',
		// 	label: 'Users',
		// 	path: '/settings/users',
		// },
		{
			icon: 'category',
			label: 'Categories',
			path: '/settings/categories',
		},
		{
			icon: 'bubble_chart',
			label: 'Units',
			path: '/settings/units',
		},
	];

	constructor() {}

	ngOnInit(): void {}
}
