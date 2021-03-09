import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Reports', path: '/reports', isLink: true }];

  constructor() {}

  ngOnInit(): void {}
}
