import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import Calendar from '@/src/domain/aggregation/calendar';
import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import Today from '@/src/domain/aggregation/today';

import Budget from '../../budget';
import DailyCostMap from '../../dailyCostMap';

import { ActiveBudgetMetrics } from './metrics';

export default async function makeActiveBudget(
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
  const expenses = await expenseRepository.findSome(
    [budgetPlan.categoryId],
    period.start.datetime,
    period.end.datetime,
  );
  const actualDailyCost = DailyCostMap.fromList(expenses);

  // 3. 期間全体のメトリクス計算
  const periodSpending = actualDailyCost.calcTotal();
  const periodRemaining = activeBudget.money.value - periodSpending;
  const remainingDays = period.end.diffDays(today.date) + 1;

  // 4. 今日のメトリクス計算
  const actualWithoutToday = actualDailyCost.deleteAt(today.date);
  const allocated = activeBudget.allocate(actualWithoutToday, today);
  const todayBudget = allocated.get(today.date) ?? 0;
  const todaySpending = actualDailyCost.get(today.date) ?? 0;

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
