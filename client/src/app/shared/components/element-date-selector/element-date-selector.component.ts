import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDateRange } from '../../models/date-range.model';
import { IDateSelector } from '../../models/date-selector.model';

@Component({
  selector: 'app-element-date-selector',
  templateUrl: './element-date-selector.component.html',
  styleUrls: ['./element-date-selector.component.scss'],
})
export class ElementDateSelectorComponent implements OnInit {
  @Input() optionsList: string[];
  @Input() defaultOption: string;
  @Output() dateSelector = new EventEmitter<IDateSelector>();

  optionSelected: string;

  constructor(public utils: UtilsService) {}

  date: Date;
  dateRange: IDateRange;

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
    this.dateRange = this.utils.getMonthRange(this.date);
    this.emitDateSelector();
  }

  getPreviousMonth(): void {
    this.date = this.utils.getPreviousMonth(this.date);
    this.dateRange = this.utils.getMonthRange(this.date);
    this.emitDateSelector();
  }

  getNextYear(): void {
    this.date = this.utils.getNextYear(this.date);
    this.dateRange = this.utils.getYearRange(this.date);
    this.emitDateSelector();
  }

  getPreviousYear(): void {
    this.date = this.utils.getPreviousYear(this.date);
    this.dateRange = this.utils.getYearRange(this.date);
    this.emitDateSelector();
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
    this.dateRange = {
      start: this.startDate,
      end: this.endDate,
    };
    this.emitDateSelector();
  }

  emitDateSelector(): void {
    this.dateSelector.emit({ type: this.optionSelected, dateRange: this.dateRange });
  }
}
