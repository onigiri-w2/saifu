import Today from '@/src/domain/aggregation/today';
import { ValidationError } from '@/src/domain/error';

import Budget from '../../budget';
import DateExpensesMap from '../../expenseMap/dateExpensesMap';

class ThisCycleMonitor {
  private constructor(
    public readonly categoryId: string,
    private readonly budget: Budget,
    private readonly expenseMap: DateExpensesMap,
    private readonly today: Today,
  ) {
    this._validate();
  }

  static build(categoryId: string, budget: Budget, expenseMap: DateExpensesMap, today: Today) {
    return new ThisCycleMonitor(categoryId, budget, expenseMap, today);
  }

  overview() {
    const actualExpenses = this.expenseMap.genTotalEachDate();
    const period = this.budget.period;
    const remainingDays = period.end.diffDays(this.today.date) + 1;

    // actualからtodayを無くしたデータに予算をかけさせることで、今日の本来の予算を取得できる。
    const actualWithoutToday = actualExpenses.deleteAt(this.today.date);
    const todayBudget = this.budget.allocate(actualWithoutToday, this.today).getValue(this.today.date);
    const todaySpending = actualExpenses.getValue(this.today.date) ?? 0;

    return {
      budget: this.budget.money.value,
      spending: actualExpenses.calcTotal(),
      remainingDays,
      totalDays: period.length,
      todayBudget,
      todaySpending,
    };
  }

  remainingEntirlyMoney() {
    const overview = this.overview();
    return overview.budget - overview.spending;
  }
  remainingEntirlyDays() {
    return this.overview().remainingDays;
  }

  remainingTodayMoney() {
    const overview = this.overview();
    if (overview.todayBudget === undefined || overview.todaySpending === undefined) return undefined;
    return overview.todayBudget - overview.todaySpending;
  }

  diffEntirlyMoneyForPlan() {
    const overview = this.overview();
    // planを計算
    const planEachDay = overview.budget / overview.totalDays;
    const planUntilToday = planEachDay * overview.remainingDays;

    return this.remainingEntirlyMoney() - planUntilToday;
  }

  private _validate() {
    if (!this.budget.period.includes(this.today.date)) {
      throw new ValidationError('予算期間に今日が含まれていません', {
        context: { today: this.today, period: this.budget.period },
      });
    }
  }
}
export default ThisCycleMonitor;
