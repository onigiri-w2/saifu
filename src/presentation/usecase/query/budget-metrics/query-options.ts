import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { QueryKeys } from '../query-keys';

import { loadAllActiveBudgetMetrics } from './functions/loadActiveBudget';

export const BudgetMetricsQueryOptions = {
  active: {
    all: () =>
      queryOptionsRQ({
        queryKey: QueryKeys['budget-metrics'].active.all,
        queryFn: loadAllActiveBudgetMetrics,
      }),
  },
};
