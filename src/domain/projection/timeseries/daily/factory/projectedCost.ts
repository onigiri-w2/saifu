import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import Today from '@/src/domain/aggregation/today';
import Period from '@/src/domain/valueobject/period';

import Budget from '../../../budget';

import { createFromExpenses } from './common';

export async function createProjectedCost(
  categoryId: string,
  period: Period,
  budgets: Budget[],
  today: Today,
  expenseRepository: IExpenseRepository,
) {
  // まずactualな値のタイムシリーズを作成。これがベースとなり、後で予算期間の値で上書きされる。
  const actualExpenses = await expenseRepository.findSome([categoryId], period.start.datetime, period.end.datetime);
  const actualTimeseries = createFromExpenses(actualExpenses, period);

  const budgetsPeriod = Period.merge(budgets.map((budget) => budget.period));
  if (!budgetsPeriod) return actualTimeseries;

  // 予算期間における実際の支出からタイムシリーズを作成
  const expensesInBudgetsPeriod = await expenseRepository.findSome(
    [categoryId],
    budgetsPeriod.start.datetime,
    budgetsPeriod.end.datetime,
  );
  const timeseriesInBudgetsPeriod = createFromExpenses(expensesInBudgetsPeriod, budgetsPeriod);

  // 各予算の値で上書き。予算期間外の値は実際の支出のまま維持される
  budgets.forEach((budget) => {
    const budgetedTimeSeries = budget.allocateTo(
      timeseriesInBudgetsPeriod.extract(budget.period.start, budget.period.end),
      today.date,
    );
    budgetedTimeSeries.asFlow().forEach((point) => {
      if (actualTimeseries.getPeriod().includes(point.date)) {
        actualTimeseries.set(point.date, point.value);
      }
    });
  });

  return actualTimeseries;
}
