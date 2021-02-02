import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaginationControl } from '../../models/pagination-control.model';

@Component({
  selector: 'app-element-paginator',
  templateUrl: './element-paginator.component.html',
  styleUrls: ['./element-paginator.component.scss'],
})
export class ElementPaginatorComponent {
  @Input() refresh: EventEmitter<any>;
  @Input() total: number;
  @Input() page: number;
  @Input() limit: number;
  @Output() paginationControl = new EventEmitter<IPaginationControl>();

  constructor() {}

  previousPage() {
    this.page -= 1;
    this.paginationControl.emit({
      pagination: true,
      page: this.page,
      limit: this.limit,
    });
  }

  nextPage() {
    this.page += 1;
    this.paginationControl.emit({
      pagination: true,
      page: this.page,
      limit: this.limit,
    });
  }
}
