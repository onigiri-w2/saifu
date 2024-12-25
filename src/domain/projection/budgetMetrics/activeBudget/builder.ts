import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import Calendar from '@/src/domain/aggregation/calendar';
import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import Today from '@/src/domain/aggregation/today';

import Budget from '../../budget';
import { buildActualCost } from '../../timeseries/daily/builder/actualCost';

import { ActiveBudgetMetrics } from './metrics';

export default async function buildActiveBudget(
  budgetPlan: BudgetPlan,
  calendar: Calendar,
  today: Today,
  expenseRepository: IExpenseRepository,
): Promise<ActiveBudgetMetrics | undefined> {
  // 1. アクティブな予算期間の作成
  const activeBudget = Budget.fromBudgetPlan(budgetPlan, calendar.cycleStartDef, today, today.date);
  if (!activeBudget) return undefined;
  const period = activeBudget.period;

  // 2. 期間内の支出データの取得
  const actualTimeseries = await buildActualCost([budgetPlan.categoryId], period, expenseRepository);

  // 3. 期間全体のメトリクス計算
  const periodSpending = actualTimeseries.calcSum();
  const periodRemaining = activeBudget.money.value - periodSpending;
  const remainingDays = period.end.diffDays(today.date) + 1;

  // 4. 今日のメトリクス計算
  const actualWithoutToday = actualTimeseries.cloneWith();
  actualWithoutToday.set(today.date, 0);
  const allocated = activeBudget.allocateTo(actualWithoutToday, today.date);
  const todayBudget = allocated.get(today.date) ?? 0;
  const todaySpending = actualTimeseries.get(today.date) ?? 0;

  // 5. 理想の使用ペースとの差分計算
  const idealDailyBudget = activeBudget.money.value / period.length;
  const idealRemainingBudget = idealDailyBudget * remainingDays;
  const paceDeviation = periodRemaining - idealRemainingBudget;

  return {
    period: {
      money: {
        budget: activeBudget.money.value,
        spending: periodSpending,
        paceDeviation,
      },
      days: {
        total: period.length,
        remaining: remainingDays,
      },
    },
    today: {
      money: {
        budget: todayBudget,
        spending: todaySpending,
      },
    },
  };
}
