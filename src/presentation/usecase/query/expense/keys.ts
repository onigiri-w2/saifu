import Yearmonth from '@/src/domain/valueobject/yearmonth';

const root = 'expenses';
export const keys = {
  monthly: (yearmonth: Yearmonth) => [root, 'monthly', yearmonth.toString()],
};
