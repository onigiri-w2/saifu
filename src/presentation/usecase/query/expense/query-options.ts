import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadMonthlyExpenses } from './functions';
import { keys } from './keys';

export const queryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: keys.monthly(yearmonth),
      queryFn: async () => loadMonthlyExpenses(yearmonth),
    }),
};
