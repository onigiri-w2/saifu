import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadAllActiveBudgetMetrics } from './functions';
import { budgetMetricsKeys } from './keys';

export const budgetMetricsQueryOptions = {
  'active/list': () =>
    queryOptionsRQ({
      queryKey: budgetMetricsKeys['active/list'],
      queryFn: loadAllActiveBudgetMetrics,
    }),
};
