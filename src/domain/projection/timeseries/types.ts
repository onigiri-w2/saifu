import LocalDate from '../../valueobject/localdate';
import Period from '../../valueobject/period';

export type DataPoint = {
  date: LocalDate;
  value: number;
};
export interface ITimeSeries {
  asFlow(): DataPoint[];
  asStock(): DataPoint[];
  getPeriod(): Period;
}
