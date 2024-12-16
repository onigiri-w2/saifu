import BudgetPlan from '../../aggregation/budgetPlan';
import IExpenseRepository from '../../aggregation/expense/repository.type';
import Today from '../../aggregation/today';
import CycleStartDef from '../../valueobject/cycleStartDef';
import Budget from '../budget';
import DateExpensesMap from '../expenseMap/dateExpensesMap';

import ThisCycleMonitor from './monitors/thisCycle';

class BudgetMonitorFactory {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async forThisCycle(
    budgetPlan: BudgetPlan,
    today: Today,
    cycleStartDef: CycleStartDef,
  ): Promise<ThisCycleMonitor | undefined> {
    const budget = Budget.fromBudgetPlan(budgetPlan, cycleStartDef, today, today.date);
    if (!budget) return undefined;
    const period = budget.period;

    const expenses = await this.expenseRepository.findSome(
      [budgetPlan.categoryId],
      period.start.datetime,
      period.end.datetime,
    );
    return ThisCycleMonitor.build(budgetPlan.categoryId, budget, DateExpensesMap.fromList(expenses), today);
  }
}

export default BudgetMonitorFactory;
