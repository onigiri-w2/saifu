import BudgetPlan from '@/src/domain/model/aggregation/budgetPlan';
import Calendar from '@/src/domain/model/aggregation/calendar';
import ITransactionRepository from '@/src/domain/model/aggregation/transaction/repository.type';

import Budget from '../../budget';
import { buildActualCost } from '../../timeseries/daily/builder/actualCostTrend';

import { ActiveBudgetMetrics } from './metrics';

export default async function buildActiveBudgetMetrics(
  budgetPlan: BudgetPlan,
  calendar: Calendar,
  transactionRepository: ITransactionRepository,
): Promise<ActiveBudgetMetrics | undefined> {
  // 1. アクティブな予算期間の作成
  const activeBudget = Budget.fromBudgetPlan(budgetPlan, calendar.cycleStartDef, calendar.today, calendar.today.date);
  if (!activeBudget) return undefined;
  const period = activeBudget.period;

  // 2. 期間内の支出データの取得
  const actualTimeseries = await buildActualCost(budgetPlan.categoryIds, period, transactionRepository);

  // 3. 期間全体のメトリクス計算
  const periodSpending = actualTimeseries.calcSum();
  const periodRemaining = activeBudget.money.value - periodSpending;
  const remainingDays = period.end.diffDays(calendar.today.date) + 1;

  // 4. 今日のメトリクス計算
  const actualWithoutToday = actualTimeseries.cloneWith();
  actualWithoutToday.set(calendar.today.date, 0);
  const allocated = activeBudget.allocateTo(actualWithoutToday, calendar.today.date);
  const todayBudget = allocated.get(calendar.today.date) ?? 0;
  const todaySpending = actualTimeseries.get(calendar.today.date) ?? 0;

  // 5. 理想の使用ペースとの差分計算
  const idealDailyBudget = activeBudget.money.value / period.length;
  const idealRemainingBudget = idealDailyBudget * remainingDays;
  const paceDeviation = periodRemaining - idealRemainingBudget;

  return {
    budgetPlanId: budgetPlan.id.value,
    categoryIds: budgetPlan.categoryIds.map((v) => v.value),
    data: {
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
    },
  };
}
