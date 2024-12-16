import BudgetPlan from '../../aggregation/budgetPlan';
import { isRegularlyStrategy } from '../../aggregation/budgetPlan/strategy/regularly';
import Today from '../../aggregation/today';
import CycleStartDef from '../../valueobject/cycleStartDef';
import LocalDate from '../../valueobject/localdate';
import Money from '../../valueobject/money';
import Period from '../../valueobject/period';
import DailyCostMap from '../dailyCostMap';

class Budget {
  private constructor(
    public readonly money: Money,
    public readonly period: Period,
  ) {}

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

  /**
   *  期日内、かつ、昨日までの出費を考慮して今日以降に予算を振り分ける
   *  @param actual 出費のマップ
   *  @param today 今日の日付
   */
  allocate(actual: DailyCostMap, today: Today): DailyCostMap {
    if (today.date.isAfterThan(this.period.end)) {
      return actual;
    }

    // 期間内、かつ、昨日までの出費を計算（今日が期間より前の場合は0）
    const yesterday = today.date.addDays(-1);
    const spendingToYesterday = actual.extract(this.period.start, yesterday).calcTotal();
    const remainingFromToday = Math.max(this.money.value - spendingToYesterday, 0);

    let distributedPeriod = Period.build(today.date, this.period.end);
    if (this.period.start.isAfterThan(today.date)) {
      distributedPeriod = Period.build(this.period.start, distributedPeriod.end);
    }
    return this._distributeRemaining(actual, distributedPeriod, remainingFromToday);
  }

  private _distributeRemaining(actual: DailyCostMap, period: Period, remaining: number): DailyCostMap {
    // 0. 事前準備
    let result = actual;
    const slicedDist = actual.extract(period.start, period.end);
    const list = slicedDist.genList().sort((a, b) => b.value - a.value);

    // 1. dist.total()がremainingより大きい場合、何もせずに返す
    if (slicedDist.calcTotal() >= remaining) return actual;

    let baseDaily = Math.floor(remaining / period.length);
    const exceeded = [];
    for (const [i, l] of list.entries()) {
      const diff = baseDaily - l.value;
      if (diff >= 0) break;
      const nextLength = period.length - i - 1;
      exceeded.push(l);
      const exceededSum = exceeded.reduce((acc, cur) => acc + cur.value, 0);
      if (nextLength > 0) baseDaily = Math.floor((remaining - exceededSum) / nextLength);
    }

    // 2. 端数調整しながら振り分ける
    let fraction =
      remaining - (period.length - exceeded.length) * baseDaily - exceeded.reduce((acc, cur) => acc + cur.value, 0);
    for (const date of period.genArray()) {
      if (exceeded.find((e) => e.localdate.isSame(date))) continue;
      const df = fraction > 0 ? 1 : 0;
      result = result.updateAt(date, baseDaily + df);
      fraction -= 1;
    }
    return result;
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
