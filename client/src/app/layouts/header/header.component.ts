import { Component, OnInit } from '@angular/core';

declare interface INavItem {
  icon: string;
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
      icon: 'home',
      label: 'Inventory',
      path: '/inventory',
    },
    {
      icon: 'home',
      label: 'Purchases',
      path: '/purchases',
    },
    {
      icon: 'home',
      label: 'Sales',
      path: '/sales',
    },
    {
      icon: 'home',
      label: 'Products',
      path: '/products',
    },
    {
      icon: 'settings',
      label: 'Settings',
      path: '/settings',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
