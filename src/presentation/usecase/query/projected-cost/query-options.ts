import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { MonthlyProjectionUsecase } from './functions';
import { projectedCostKeys } from './keys';

export const projectedCostQueryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCostKeys.monthly(yearmonth),
      queryFn: () => new MonthlyProjectionUsecase().loadEach(yearmonth),
    }),
  'monthly/aggregated': (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: projectedCostKeys['monthly/aggregated'](yearmonth),
      queryFn: () => new MonthlyProjectionUsecase().loadAggregated(yearmonth),
    }),
};
