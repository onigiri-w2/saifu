import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { QueryKeys } from '../query-keys';

import { loadAllBudgetPlan, loadBudgetPlanByCategoryId } from './functions/loadAll';

export const BudgetPlanQueryOptions = {
  list: () =>
    queryOptionsRQ({
      queryKey: QueryKeys['budget-plan'].list,
      queryFn: loadAllBudgetPlan,
    }),
  hasCategoryId: (categoryId: string) =>
    queryOptionsRQ({
      queryKey: QueryKeys['budget-plan'].hasCategoryId(categoryId),
      queryFn: () => loadBudgetPlanByCategoryId(categoryId),
    }),
};
