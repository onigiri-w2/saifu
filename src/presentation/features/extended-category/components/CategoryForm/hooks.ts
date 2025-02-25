import { useDeferredValue, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

export const useExtendedCategory = (categoryId: string, useDeferredRendering: boolean) => {
  const [categoryQuery, budgetPlanQuery] = useSuspenseQueries({
    queries: [QueryOptions.transactionCategory.detail(categoryId), QueryOptions.budgetPlan.hasCategoryId(categoryId)],
  });

  const extendedCategory = useMemo(() => {
    return {
      category: categoryQuery.data,
      budgetPlan: budgetPlanQuery.data,
    };
  }, [categoryQuery.data, budgetPlanQuery.data]);

  const deferredExtendedCategory = useDeferredValue(extendedCategory);
  return useDeferredRendering ? deferredExtendedCategory : extendedCategory;
};
