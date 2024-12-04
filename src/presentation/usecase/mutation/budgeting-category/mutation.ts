import { QueryClient, useMutation } from '@tanstack/react-query';

import { budgetingCategoryKeys } from '../../query/budgeting-category/keys';

import { addBudgetingCategory, deleteBudgetingCategory, updateBudgetingCategory } from './functions';

export const useBudgetingCategoryMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: addBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: budgetingCategoryKeys.list });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: budgetingCategoryKeys.list });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteBudgetingCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: budgetingCategoryKeys.list });
      },
    });
  },
};
