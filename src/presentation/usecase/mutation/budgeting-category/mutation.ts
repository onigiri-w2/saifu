import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { addBudgetingCategory, deleteBudgetingCategory, updateBudgetingCategory } from './functions';

export const useBudgetingCategoryMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: addBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.category.root, refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.category.root, refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.category.root, refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
      },
    });
  },
};
