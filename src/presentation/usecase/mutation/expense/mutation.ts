import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { createExpense, deleteExpense, updateExpense } from './functions';

export const useExpenseMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: createExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
      },
    });
  },
  delete: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: deleteExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.expense.root });
        queryClient.invalidateQueries({ queryKey: keys.costStock.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
      },
    });
  },
};
