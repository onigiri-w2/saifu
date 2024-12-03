import DateExpensesMap from '@/src/domain/projection/expenseMap/dateExpensesMap';

import Today from '../../../aggregation/today';
import Period from '../../../valueobject/period';
import { DailyFlow } from '../../../valueobject/timeseries';
import Budget from '../../budget';

class BudgetedCostFlow {
  public readonly flow!: DailyFlow;
  private constructor(period: Period, budgets: Budget[], expensesMap: DateExpensesMap, today: Today) {
    let totalEachDate = expensesMap.genTotalEachDate();
    budgets.forEach((b) => {
      totalEachDate = totalEachDate.merge(b.allocate(totalEachDate, today));
    });

    this.flow = DailyFlow.fromMap(totalEachDate.getMap(), period);
  }

  static build(period: Period, budgets: Budget[], expensesMap: DateExpensesMap, today: Today): BudgetedCostFlow {
    return new BudgetedCostFlow(period, budgets, expensesMap, today);
  }
}

export default BudgetedCostFlow;
