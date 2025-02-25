import { useDeferredValue } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

export const useMetrics = (useDeferredRendering: boolean) => {
  const [categoryQuery, metricsQuery] = useSuspenseQueries({
    queries: [QueryOptions.transactionCategory.list(), QueryOptions.budgetMetrics.active.all()],
  });
  const deferredMetrics = useDeferredValue(metricsQuery.data);
  const deferredCategories = useDeferredValue(categoryQuery.data);

  return {
    metrics: useDeferredRendering ? deferredMetrics : metricsQuery.data,
    categories: useDeferredRendering ? deferredCategories : categoryQuery.data,
  };
};
