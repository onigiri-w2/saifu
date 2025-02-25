import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { QueryKeys } from '../query-keys';

import { loadAllTransactionCategories, loadTransactionCategory } from './functions/loadAll';

export const TransactionCategoryQueryOptions = {
  list: () =>
    queryOptionsRQ({
      queryKey: QueryKeys['transaction-category'].list,
      queryFn: loadAllTransactionCategories,
    }),
  detail: (id: string) =>
    queryOptionsRQ({
      queryKey: QueryKeys.transaction.detail(id),
      queryFn: () => loadTransactionCategory(id),
    }),
};
