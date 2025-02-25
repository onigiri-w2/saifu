import { BudgetMetricsQueryOptions } from './budget-metrics/query-options';
import { BudgetPlanQueryOptions } from './budget-plan/query-options';
import { TransactionQueryOptions } from './transaction/query-options';
import { TransactionCategoryQueryOptions } from './transaction-category/query-options';

export const QueryOptions = {
  transaction: TransactionQueryOptions,
  transactionCategory: TransactionCategoryQueryOptions,
  budgetPlan: BudgetPlanQueryOptions,
  budgetMetrics: BudgetMetricsQueryOptions,
} as const;
