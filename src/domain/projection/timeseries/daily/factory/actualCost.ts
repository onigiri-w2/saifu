import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import Period from '@/src/domain/valueobject/period';

import { DailyTimeSeries } from '../timeseries';

import { createFromExpenses } from './common';

export async function create(
  categoryId: string,
  period: Period,
  repositories: { expenseRespository: IExpenseRepository },
): Promise<DailyTimeSeries> {
  const start = period.start.datetime;
  const end = new Date(period.end.datetime.getTime() - 1);
  const expenses = await repositories.expenseRespository.findSome([categoryId], start, end);
  return createFromExpenses(expenses, period);
}

export async function createAggregated(
  categoryIds: string[],
  period: Period,
  repositories: { expenseRespository: IExpenseRepository },
): Promise<DailyTimeSeries> {
  const start = period.start.datetime;
  const end = new Date(period.end.datetime.getTime() - 1);

  const expenses = await repositories.expenseRespository.findSome(categoryIds, start, end);
  return createFromExpenses(expenses, period);
}
