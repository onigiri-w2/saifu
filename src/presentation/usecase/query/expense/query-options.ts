import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadExpense, loadMonthlyExpenses, loadMonthlyTimeline } from './functions';
import { expenseQueryKeys } from './keys';

export const expenseQueryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: expenseQueryKeys.monthly(yearmonth),
      queryFn: async () => loadMonthlyExpenses(yearmonth),
    }),
  'monthly/timeline': (yearmonth: Yearmonth, asc: boolean) =>
    queryOptionsRQ({
      queryKey: expenseQueryKeys['monthly/timeline'](yearmonth, asc),
      queryFn: async () => loadMonthlyTimeline(yearmonth, asc),
    }),
  detail: (id: string) =>
    queryOptionsRQ({
      queryKey: expenseQueryKeys.detail(id),
      queryFn: async () => loadExpense(id),
    }),
};
