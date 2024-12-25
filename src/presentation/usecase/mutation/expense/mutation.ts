import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { createExpense, deleteExpense, updateExpense } from './functions';

export const useExpenseMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: createExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMetrics.root });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMetrics.root });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.projectedCost.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMetrics.root });
      },
    });
  },
};
