import { useDeferredValue, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

import { ExtendedCategory } from '../../types';

export const useExtendedCategories = (useDeferredRendering: boolean): ExtendedCategory[] => {
  const [categoryQuery, budgetPlanQuery] = useSuspenseQueries({
    queries: [QueryOptions.transactionCategory.list(), QueryOptions.budgetPlan.list()],
  });

  const extendedCategories = useMemo(() => {
    return categoryQuery.data.map((category) => {
      const budgetPlan = budgetPlanQuery.data.find((plan) =>
        plan.categoryIds.map((id) => id.value).includes(category.id.value),
      );
      return { category, budgetPlan };
    });
  }, [categoryQuery.data, budgetPlanQuery.data]);

  const deferredExtendedCategories = useDeferredValue(extendedCategories);

  return useDeferredRendering ? deferredExtendedCategories : extendedCategories;
};
