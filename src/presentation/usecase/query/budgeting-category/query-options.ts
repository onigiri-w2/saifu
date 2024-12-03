import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadBudgetingCategories, loadBudgetingCategory } from './functions';
import { keys } from './keys';

export const queryOptions = {
  list: () =>
    queryOptionsRQ({
      queryKey: keys.list,
      queryFn: loadBudgetingCategories,
    }),
  detail: (id: string) =>
    queryOptionsRQ({
      queryKey: keys.detail(id),
      queryFn: () => loadBudgetingCategory(id),
    }),
};
