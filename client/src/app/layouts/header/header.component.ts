import { Component, OnInit } from '@angular/core';

declare interface INavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  navList: INavItem[] = [
    {
      label: 'Sales',
      path: '/sales',
    },
    {
      label: 'Purchases',
      path: '/purchases',
    },
    {
      label: 'Inventory',
      path: '/inventory',
    },
    {
      label: 'Products',
      path: '/products',
    },
    {
      label: 'Reports',
      path: '/reports',
    },
    {
      label: 'Settings',
      path: '/settings',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
