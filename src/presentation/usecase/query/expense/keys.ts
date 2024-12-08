import Yearmonth from '@/src/domain/valueobject/yearmonth';

const root = 'expenses';
export const expenseQueryKeys = {
  'monthly/timeline': (yearmonth: Yearmonth, asc: boolean) => [
    root,
    'monthly',
    yearmonth.toString(),
    'timeline',
    { asc },
  ],
  monthly: (yearmonth: Yearmonth) => [root, 'monthly', yearmonth.toString()],
  detail: (id: string) => [root, 'detail', id],
};
