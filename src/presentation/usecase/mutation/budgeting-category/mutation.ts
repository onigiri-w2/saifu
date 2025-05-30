import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { createBudgetingCategory, deleteBudgetingCategory, updateBudgetingCategory } from './functions';

export const useBudgetingCategoryMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: createBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.resetQueries({ queryKey: keys.category.detail(data.category.id) });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCostStock.root });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.resetQueries({ queryKey: keys.category.detail(data.category.id) });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCostStock.root });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteBudgetingCategory,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.category.list });
        queryClient.removeQueries({ queryKey: keys.category.detail(data?.id ?? '') });
        queryClient.invalidateQueries({ queryKey: keys.projectedCostStock.root });
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
      },
    });
  },
};
