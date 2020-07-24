import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDateRange } from '../../models/date-range.model';

@Component({
  selector: 'app-element-date-selector',
  templateUrl: './element-date-selector.component.html',
  styleUrls: ['./element-date-selector.component.scss'],
})
export class ElementDateSelectorComponent implements OnInit {
  @Input() optionsList: string[];
  @Input() defaultOption: string;
  @Output() dateRange = new EventEmitter<IDateRange>();

  optionSelected: string;

  constructor(public utils: UtilsService) {}

  date: Date;
  _dateRange: IDateRange;

  startDate: Date;
  endDate: Date;

  ngOnInit(): void {
    this.optionsList = this.optionsList || ['month', 'year', 'dateRange'];
    this.optionSelected = this.defaultOption || this.optionsList.find(() => true);
    this.date = this.utils.getCurrentDate();
  }

  getCurrentDate(): void {
    this.date = new Date();
  }

  getNextMonth(): void {
    this.date = this.utils.getNextMonth(this.date);
    this._dateRange = this.utils.getMonthRange(this.date);
    this.emitDateRange();
  }

  getPreviousMonth(): void {
    this.date = this.utils.getPreviousMonth(this.date);
    this._dateRange = this.utils.getMonthRange(this.date);
    this.emitDateRange();
  }

  getNextYear(): void {
    this.date = this.utils.getNextYear(this.date);
    this._dateRange = this.utils.getYearRange(this.date);
    this.emitDateRange();
  }

  getPreviousYear(): void {
    this.date = this.utils.getPreviousYear(this.date);
    this._dateRange = this.utils.getYearRange(this.date);
    this.emitDateRange();
  }

  emitDateRange(): void {
    this.dateRange.emit(this._dateRange);
  }

  optionDisplay(option: string) {
    const optionMapper = {
      month: 'Month',
      year: 'Year',
      dateRange: 'Date range',
    };

    return optionMapper[option];
  }

  setDateRange(): void {
    this._dateRange = {
      start: this.startDate,
      end: this.endDate,
    };
    this.emitDateRange();
  }
}
