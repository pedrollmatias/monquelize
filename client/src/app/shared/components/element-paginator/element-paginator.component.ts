import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPaginationControl } from '../../models/pagination-control.model';

const LIMIT = 1;

@Component({
  selector: 'app-element-paginator',
  templateUrl: './element-paginator.component.html',
  styleUrls: ['./element-paginator.component.scss'],
})
export class ElementPaginatorComponent implements OnInit {
  @Input() refresh: EventEmitter<any>;
  @Input() total: number;
  @Output() paginationControl = new EventEmitter<IPaginationControl>();

  limit: number;
  page = 0;

  constructor() {}

  ngOnInit(): void {
    this.setLimit();
  }

  setLimit(): void {
    this.limit = this.total < LIMIT ? this.total : LIMIT;
  }

  previousPage() {
    this.page -= 1;
    this.paginationControl.emit({
      page: this.page,
      limit: this.limit,
    });
  }

  nextPage() {
    this.page += 1;
    this.paginationControl.emit({
      page: this.page,
      limit: this.limit,
    });
  }

  refreshComponent(): void {
    this.page = 0;
    this.setLimit();
  }
}
