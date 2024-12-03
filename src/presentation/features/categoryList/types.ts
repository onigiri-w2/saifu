import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';

import { BudgetingCategory } from '../../usecase/query/budgeting-category/functions';

export type MonitorViewData = {
  monitor: ThisCycleMonitor;
  category: BudgetingCategory;
};
