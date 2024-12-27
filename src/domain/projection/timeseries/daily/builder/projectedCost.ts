import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import Calendar from '@/src/domain/aggregation/calendar';
import { ExpenseCategoryId } from '@/src/domain/aggregation/expenseCategory';
import Today from '@/src/domain/aggregation/today';
import { DomainValidationError } from '@/src/domain/error';
import Period from '@/src/domain/valueobject/period';
import { assert } from '@/src/utils/errors';

import Budget, { buildBudgetsInPeriod } from '../../../budget';
import { DailyTimeSeries } from '../timeseries';

export class ProjectedCostBuilder {
  public readonly budgets!: Budget[];
  constructor(
    public readonly categoryId: ExpenseCategoryId,
    private readonly period: Period,
    private readonly today: Today,
    calendar: Calendar,
    budgetPlan: BudgetPlan,
  ) {
    this.budgets = buildBudgetsInPeriod(budgetPlan, calendar.cycleStartDef, today, period);
    if (!budgetPlan.categoryId.equals(categoryId)) {
      throw new DomainValidationError('budgetPlan.categoryIdとcategoryIdが一致しません');
    }
  }

  get requiredPeriodOfActual(): Period {
    const budgetsPeriod = Period.merge(this.budgets.map((b) => b.period));
    if (budgetsPeriod === undefined) return this.period;

    return Period.merge([this.period, budgetsPeriod]) ?? this.period;
  }

  build(actual: DailyTimeSeries): DailyTimeSeries {
    assert(
      actual.getPeriod().isSame(this.requiredPeriodOfActual),
      'actualの期間が不正です。this.requiredPeriodOfActualと合わせてください',
    );
    const projected = actual.cloneWith();
    this.budgets.forEach((budget) => {
      const budgeted = budget.allocateTo(actual.extract(budget.period.start, budget.period.end), this.today.date);
      projected.override(budgeted);
    });
    return projected.extract(this.period.start, this.period.end);
  }
}
