import { useMemo } from 'react';

import { MonthlyTimeline } from '@/src/presentation/usecase/query/expense/functions';

import { TimelineViewData } from '../types';

export const useTimelineViewData = (timeline: MonthlyTimeline) => {
  return useMemo(() => {
    if (timeline.length === 0) return [];

    const result: TimelineViewData = [];
    timeline.forEach((dateset) => {
      result.push(dateset.date);
      result.push(...dateset.expenses);
    });
    return result;
  }, [timeline]);
};
