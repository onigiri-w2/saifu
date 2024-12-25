import Yearmonth from '@/src/domain/valueobject/yearmonth';

const root = 'projected-timeseries';
export const projectedCostKeys = {
  root: [root],
  monthly: (yearmonth: Yearmonth) => [root, 'monthly', JSON.stringify(yearmonth)],
  'monthly/aggregated': (yearmonth: Yearmonth) => [root, 'monthly', 'aggregated', JSON.stringify(yearmonth)],
};
