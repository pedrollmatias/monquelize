import { IDateRange } from './date-range.model';

export interface IDateSelector {
  type: string;
  dateRange: IDateRange;
}
