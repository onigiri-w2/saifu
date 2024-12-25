import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadMonthlyAggregatedTimeSeries, loadMonthlyTimeSeries } from './functions';
import { projectedCostKeys } from './keys';

export const projectedCostQueryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCostKeys.monthly(yearmonth),
      queryFn: () => loadMonthlyTimeSeries(yearmonth),
    }),
  'monthly/aggregated': (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCostKeys['monthly/aggregated'](yearmonth),
      queryFn: () => loadMonthlyAggregatedTimeSeries(yearmonth),
    }),
};
