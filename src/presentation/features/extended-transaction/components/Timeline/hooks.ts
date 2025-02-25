import { useDeferredValue, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import Transaction from '@/src/domain/model/aggregation/transaction';
import { DailySummary } from '@/src/domain/model/projection/transactionTimeline/timeline';
import Period from '@/src/domain/model/valueobject/period';
import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

import { ExtendedTransaction } from '../../types';

export const useTimeline = (period: Period, useDeferredRendering: boolean) => {
  const [timelineQuery, categoryQuery] = useSuspenseQueries({
    queries: [
      QueryOptions.transaction['timeline/period'](period, { order: 'desc' }),
      QueryOptions.transactionCategory.list(),
    ],
  });
  const timeline = useMemo(() => {
    return timelineQuery.data.timeline
      .map((value) => {
        if (value instanceof Transaction) {
          const category = categoryQuery.data.find((category) => category.id.equals(value.categoryId));
          if (!category) return null;
          return {
            transaction: value,
            category,
          };
        }
        return value;
      })
      .filter((value): value is ExtendedTransaction | DailySummary => value !== null);
  }, [timelineQuery.data, categoryQuery.data]);

  const deferredTimeline = useDeferredValue(timeline);
  return useDeferredRendering ? deferredTimeline : timeline;
};
