import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadMonthlyAggregatedStock, loadMonthlyTimeSeries } from './functions';
import { projectedCoststockKeys } from './keys';

export const projectedCoststockQueryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCoststockKeys.monthly(yearmonth),
      queryFn: () => loadMonthlyTimeSeries(yearmonth),
    }),
  'monthly/aggregated': (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCoststockKeys['monthly/aggregated'](yearmonth),
      queryFn: () => loadMonthlyAggregatedStock(yearmonth),
    }),
};
