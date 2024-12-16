import Category from '@/src/domain/aggregation/category';
import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';

export type CategoryBudgetMonitor = {
  category: Category;
  monitor: ThisCycleMonitor;
};

export type CategoryBudgetMonitorWithId = {
  id: string;
  detail: CategoryBudgetMonitor;
};
