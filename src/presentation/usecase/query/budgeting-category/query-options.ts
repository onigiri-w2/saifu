import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadBudgetingCategories, loadBudgetingCategory } from './functions';
import { budgetingCategoryKeys } from './keys';

export const budgetingCategoryQueryOptions = {
  list: () =>
    queryOptionsRQ({
      queryKey: budgetingCategoryKeys.list,
      queryFn: loadBudgetingCategories,
    }),
  detail: (id: string) =>
    queryOptionsRQ({
      queryKey: budgetingCategoryKeys.detail(id),
      queryFn: () => loadBudgetingCategory(id),
    }),
};
