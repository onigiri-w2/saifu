import Yearmonth from '@/src/domain/valueobject/yearmonth';

const root = 'cost-stocks';
export const costStockKeys = {
  root: [root],
  monthly: (yearmonth: Yearmonth) => [root, 'monthly', yearmonth.toString()],
  'monthly/aggregated': (yearmonth: Yearmonth) => [root, 'monthly', 'aggregated', yearmonth.toString()],
};
