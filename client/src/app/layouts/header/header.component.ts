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
      icon: 'sell',
      label: 'Sales',
      path: '/sales',
    },
    {
      icon: 'shopping_basket',
      label: 'Purchases',
      path: '/purchases',
    },
    {
      icon: 'inventory_2',
      label: 'Inventory',
      path: '/inventory',
    },
    {
      icon: 'shopping_cart',
      label: 'Products',
      path: '/products',
    },
    {
      icon: 'assignments',
      label: 'Reports',
      path: '/reports',
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
