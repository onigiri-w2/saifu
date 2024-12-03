import Yearmonth from '@/src/domain/valueobject/yearmonth';

const root = 'cost-stocks';
export const keys = {
  monthly: (yearmonth: Yearmonth) => [root, 'monthly', yearmonth.toString()],
};
