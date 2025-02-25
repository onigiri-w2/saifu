import { QueryClient, useMutation } from '@tanstack/react-query';

import { QueryKeys } from '../../query/query-keys';

import { createCategory, updateCategory } from './functions';

export const useCategoryMutation = {
  create: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: createCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys['transaction-category'].list });
      },
    });
  },
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys['transaction-category'].list });
      },
    });
  },
};
