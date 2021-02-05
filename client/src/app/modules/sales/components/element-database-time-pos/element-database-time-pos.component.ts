import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';

@Component({
  selector: 'app-element-database-time-pos',
  templateUrl: './element-database-time-pos.component.html',
  styleUrls: ['./element-database-time-pos.component.scss'],
})
export class ElementDatabaseTimePosComponent implements OnInit {
  @Input() databaseTimes: IDatabaseTimes;
  @Output() showPos = new EventEmitter<Boolean>();

  constructor() {}

  ngOnInit(): void {}

  onShowPosClick() {
    this.showPos.emit(true);
  }
}
