import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { createBudgetingCategory, deleteBudgetingCategory, updateBudgetingCategory } from './functions';

export const useBudgetingCategoryMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: createBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.resetQueries({ queryKey: keys.category.detail(data.category.id.value) });
        queryClient.invalidateQueries({ queryKey: keys.budgetMetrics.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.resetQueries({ queryKey: keys.category.detail(data.category.id.value) });
        queryClient.invalidateQueries({ queryKey: keys.budgetMetrics.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.removeQueries({ queryKey: keys.category.detail(data?.id.value ?? '') });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
      },
    });
  },
};
