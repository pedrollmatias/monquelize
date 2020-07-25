import { Component, OnInit } from '@angular/core';

declare interface IReportItem {
  title: string;
  icon: string;
  description: string;
  path: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportsList: IReportItem[] = [
    { title: 'Sales', icon: 'trending_up', description: 'test', path: 'sales-report' },
    { title: 'Purchases', icon: 'trending_down', description: 'test', path: 'purchases-report' },
    { title: 'Inventory', icon: 'archive', description: 'test', path: 'inventory-report' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
