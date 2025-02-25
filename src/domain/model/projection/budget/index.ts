import { assert } from '@/src/utils/errors';

import BudgetPlan from '../../aggregation/budgetPlan';
import { isRegularlyStrategy } from '../../aggregation/budgetPlan/strategy/regularly';
import CycleStartDef from '../../valueobject/cycleStartDef';
import LocalDate from '../../valueobject/localdate';
import Money from '../../valueobject/money';
import Period from '../../valueobject/period';
import Today from '../../valueobject/today';
import { DailyTimeSeries } from '../timeseries/daily/timeseries';

import { MoneyFairDistributer } from './distributer';

class Budget {
  private constructor(
    public readonly money: Money,
    public readonly period: Period,
  ) { }

  allocateTo(baseseries: DailyTimeSeries, requestedStartDate: LocalDate): DailyTimeSeries {
    this.validatePeriod(baseseries);
    if (requestedStartDate.isAfterThan(this.period.end)) return baseseries;

    const effectiveStartDate = LocalDate.max([requestedStartDate, this.period.start]);
    const remainingBudget = this.calculateRemainingBudget(baseseries, effectiveStartDate);

    // 予算を振り分ける！
    const distributedValues = new MoneyFairDistributer(0).distribute(
      remainingBudget,
      baseseries
        .extract(effectiveStartDate, this.period.end)
        .asFlow()
        .map((v) => v.value),
    );

    // 振り分けた結果をマージして返す
    const result = baseseries.cloneWith();
    distributedValues.forEach((value, i) => {
      result.set(effectiveStartDate.addDays(i), value);
    });
    return result;
  }

  private validatePeriod(baseseries: DailyTimeSeries): void {
    assert(baseseries.getPeriod().isSame(this.period), 'Budget.allocate: baseseriesの期間がBudgetの期間と一致しません');
  }

  private calculateRemainingBudget(baseseries: DailyTimeSeries, effectiveStartDate: LocalDate): number {
    const dateBeforeEffectiveStart = effectiveStartDate.subDays(1);
    if (!this.period.start.isBeforeOrEqual(dateBeforeEffectiveStart)) return this.money.value;

    const spentBudget = baseseries.extract(this.period.start, dateBeforeEffectiveStart).calcSum();
    return Math.max(this.money.value - spentBudget, 0);
  }

  static fromBudgetPlan(budgetPlan: BudgetPlan, cycleStartDef: CycleStartDef, today: Today, referenceDate: LocalDate) {
    const strategy = budgetPlan.strategy;
    if (isRegularlyStrategy(strategy)) {
      const period = cycleStartDef.genPeriod(referenceDate, strategy.cycle);
      if (period.end.isBeforeThan(today.date)) return undefined;
      if (period.includes(today.date) && strategy.tempAmount) {
        return new Budget(strategy.tempAmount, period);
      }
      return new Budget(strategy.amount, period);
    }
    return undefined;
  }

  static forTesting(money: number, period: Period) {
    return new Budget(Money.build(money), period);
  }
}
export default Budget;

export function buildBudgetsInPeriod(
  budgetPlan: BudgetPlan,
  cycleStartDef: CycleStartDef,
  today: Today,
  period: Period,
) {
  const budgets: Budget[] = [];
  if (isRegularlyStrategy(budgetPlan.strategy)) {
    let currentBudgetPeriod = cycleStartDef.genPeriod(period.start, budgetPlan.strategy.cycle);
    const budget = Budget.fromBudgetPlan(budgetPlan, cycleStartDef, today, currentBudgetPeriod.start);
    budget && budgets.push(budget);

    while (currentBudgetPeriod.end.isBeforeThan(period.end)) {
      currentBudgetPeriod = cycleStartDef.calcNextPeriod(currentBudgetPeriod, budgetPlan.strategy.cycle);
      const budget = Budget.fromBudgetPlan(budgetPlan, cycleStartDef, today, currentBudgetPeriod.start);
      budget && budgets.push(budget);
    }
  }
  return budgets;
}
