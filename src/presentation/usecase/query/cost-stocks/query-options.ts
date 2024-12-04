import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadMonthlyAggregatedCostStocks, loadMonthlyCostStocks } from './functions';
import { costStockKeys } from './keys';

export const costStockQueryOptions = {
  monthly: (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: costStockKeys.monthly(yearmonth),
      queryFn: async () => loadMonthlyCostStocks(yearmonth),
    }),
  'monthly/aggregated': (yearmonth: Yearmonth) =>
    queryOptionsRQ({
      queryKey: costStockKeys['monthly/aggregated'](yearmonth),
      queryFn: async () => loadMonthlyAggregatedCostStocks(yearmonth),
    }),
};
