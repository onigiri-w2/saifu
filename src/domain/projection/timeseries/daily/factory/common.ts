import Expense from '@/src/domain/aggregation/expense';
import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DailyTimeSeries } from '../timeseries';

export function createFromExpenses(expenses: Expense[], period: Period): DailyTimeSeries {
  const map = new HashMap<LocalDate, number>();
  expenses.forEach((e) => {
    map.set(LocalDate.fromDate(e.date), (map.get(LocalDate.fromDate(e.date)) ?? 0) + e.amount.value);
  });

  return DailyTimeSeries.fromMap(map, period);
}
