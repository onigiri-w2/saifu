import Period from '@/src/domain/model/valueobject/period';

export const QueryKeys = {
  transaction: {
    root: ['transaction'],
    'timeline/period': (period: Period, { order }: { order: 'asc' | 'desc' }) => [
      'transaction',
      'timeline',
      'monthly',
      { order, period },
    ],
    detail: (id: string) => ['transaction', 'detail', id],
  },
  'transaction-category': {
    root: ['transaction-category'],
    list: ['transaction-category', 'list'],
  },
  'budget-plan': {
    root: ['budgetPlan'],
    list: ['budgetPlan', 'list'],
    hasCategoryId: (categoryId: string) => ['budgetPlan', 'hasCategoryId', categoryId],
  },
  'budget-metrics': {
    root: ['budgetMetrics'],
    active: {
      all: ['budgetMetrics', 'active', 'all'],
    },
  },
  calendar: {
    settings: ['calendar', 'settings'],
  },
} as const;
