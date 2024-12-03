import BudgetPlan from '../../aggregation/budgetPlan';
import IExpenseRepository from '../../aggregation/expense/repository.type';
import Today from '../../aggregation/today';
import CycleStartDef from '../../valueobject/cycleStartDef';
import LocalDate from '../../valueobject/localdate';
import Period from '../../valueobject/period';
import Budget, { buildBudgetsInPeriod } from '../budget';
import DateExpensesMap from '../expenseMap/dateExpensesMap';

import BudgetedCostFlow from './flows/budgeted';

class CostFlowFactory {
  constructor(private expenseRepository: IExpenseRepository) {}

  async forBudgeted(period: Period, budgetPlan: BudgetPlan, cycleStartDef: CycleStartDef, today: Today) {
    const budgets = buildBudgetsInPeriod(budgetPlan, cycleStartDef, today, period);
    const expensePeriod = this.calculateExpensePeriod(period, budgets);

    const expenses = await this.expenseRepository.findSome(
      budgetPlan.categoryId,
      expensePeriod.start.datetime,
      expensePeriod.end.datetime,
    );

    return BudgetedCostFlow.build(period, budgets, DateExpensesMap.fromList(expenses), today);
  }

  private calculateExpensePeriod(period: Period, budgets: Budget[]): Period {
    if (budgets.length === 0) {
      return period;
    }
    const budgetPeriods = budgets.map((budget) => budget.period);
    const overallBudgetsPeriod = Period.combine(budgetPeriods);
    return Period.build(
      LocalDate.min([period.start, overallBudgetsPeriod!.start]),
      LocalDate.max([period.end, overallBudgetsPeriod!.end]),
    );
  }
}
export default CostFlowFactory;
