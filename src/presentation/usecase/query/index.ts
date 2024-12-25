import { budgetMetricsKeys } from './budget-metrics/keys';
import { budgetMetricsQueryOptions } from './budget-metrics/query-options';
import { budgetingCategoryKeys } from './budgeting-category/keys';
import { budgetingCategoryQueryOptions } from './budgeting-category/query-options';
import { calendarKeys } from './calendar/keys';
import { calendarQueryOptions } from './calendar/query-options';
import { expenseQueryKeys } from './expense/keys';
import { expenseQueryOptions } from './expense/query-options';
import { projectedCostKeys } from './projected-cost/keys';
import { projectedCostQueryOptions } from './projected-cost/query-options';
import { todayKeys } from './today/keys';
import { todayQueryOptions } from './today/query-options';

export const queryOptions = {
  category: budgetingCategoryQueryOptions,
  projectedCost: projectedCostQueryOptions,
  budgetMetrics: budgetMetricsQueryOptions,
  expense: expenseQueryOptions,
  calendar: calendarQueryOptions,
  today: todayQueryOptions,
};

export const keys = {
  category: budgetingCategoryKeys,
  projectedCost: projectedCostKeys,
  budgetMetrics: budgetMetricsKeys,
  expense: expenseQueryKeys,
  calendar: calendarKeys,
  today: todayKeys,
};
