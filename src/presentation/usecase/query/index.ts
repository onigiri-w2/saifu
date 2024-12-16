import { budgetMonitorKeys } from './budget-monitor/keys';
import { budgetMonitorQueryOptions } from './budget-monitor/query-options';
import { budgetingCategoryKeys } from './budgeting-category/keys';
import { budgetingCategoryQueryOptions } from './budgeting-category/query-options';
import { calendarKeys } from './calendar/keys';
import { calendarQueryOptions } from './calendar/query-options';
import { expenseQueryKeys } from './expense/keys';
import { expenseQueryOptions } from './expense/query-options';
import { projectedCoststockKeys } from './projected-coststock/keys';
import { projectedCoststockQueryOptions } from './projected-coststock/query-options';
import { todayKeys } from './today/keys';
import { todayQueryOptions } from './today/query-options';

export const queryOptions = {
  category: budgetingCategoryQueryOptions,
  projectedCostStock: projectedCoststockQueryOptions,
  expense: expenseQueryOptions,
  calendar: calendarQueryOptions,
  budgetMonitor: budgetMonitorQueryOptions,
  today: todayQueryOptions,
};

export const keys = {
  category: budgetingCategoryKeys,
  projectedCostStock: projectedCoststockKeys,
  expense: expenseQueryKeys,
  calendar: calendarKeys,
  budgetMonitor: budgetMonitorKeys,
  today: todayKeys,
};
