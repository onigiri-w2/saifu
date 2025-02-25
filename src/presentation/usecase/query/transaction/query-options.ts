import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import Period from '@/src/domain/model/valueobject/period';

import { QueryKeys } from '../query-keys';

import { loadTimelineByPeriod } from './functions/loadTimeline';

export const TransactionQueryOptions = {
  'timeline/period': (period: Period, { order }: { order: 'asc' | 'desc' }) =>
    queryOptionsRQ({
      queryKey: QueryKeys.transaction['timeline/period'](period, { order }),
      queryFn: () => loadTimelineByPeriod(period, { order }),
    }),
};
