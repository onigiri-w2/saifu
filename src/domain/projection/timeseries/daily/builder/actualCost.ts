import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DailyTimeSeries } from '../timeseries';

export async function buildActualCost(categoryIds: string[], period: Period, expenseRespository: IExpenseRepository) {
  const start = period.start.datetime;
  const end = new Date(period.end.datetime.getTime() - 1);
  const expenses = await expenseRespository.findSome(categoryIds, start, end);
  const map = new HashMap<LocalDate, number>();
  expenses.forEach((e) => {
    map.set(LocalDate.fromDate(e.date), (map.get(LocalDate.fromDate(e.date)) ?? 0) + e.amount.value);
  });
  return DailyTimeSeries.fromMap(map, period);
}
