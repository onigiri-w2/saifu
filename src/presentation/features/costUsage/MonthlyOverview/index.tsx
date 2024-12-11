import { useDeferredValue, useEffect, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';
import { useSharedValue } from 'react-native-reanimated';
import { useSnapshot } from 'valtio';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { withSuspense } from '@/src/presentation/components/hoc/withSuspense';
import { queryOptions } from '@/src/presentation/usecase/query';
import { convertToJsonLocalDate, JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { CategoryContext } from '../context/CategoryContext';
import { useRenderingModeSwitchContext } from '../context/RenderingModeSwitchContext';
import { useTodayContext } from '../context/TodayContext';
import { costUsagePreferenceStore } from '../store/preference.store';

import ListView from './components/ListView';
import NotFound from './components/NotFound';
import { useTimelineViewData } from './hooks';

type Props = {
  yearmonth: Yearmonth;
};
function MonthlyOverview({ yearmonth }: Props) {
  // query
  const [categoryQuery, timelineQuery, stocksQuery, aggregatedStockQuery] = useSuspenseQueries({
    queries: [
      queryOptions.category.list(),
      queryOptions.expense['monthly/timeline'](yearmonth, false),
      queryOptions.costStock.monthly(yearmonth),
      queryOptions.costStock['monthly/aggregated'](yearmonth),
    ],
  });

  // data
  const stocksOrTimeline = useSnapshot(costUsagePreferenceStore).costOrTransaction;
  const timelineViewData = useTimelineViewData(timelineQuery.data);
  const today = useTodayContext();

  // validation
  if (stocksQuery.data.length === 0) return <NotFound />;

  const viewData = useMemo(() => {
    return {
      stocks: stocksQuery.data,
      aggregatedStock: aggregatedStockQuery.data,
      timeline: timelineViewData,
      today,
      stocksOrTimeline,
    };
  }, [stocksQuery.data, aggregatedStockQuery.data, timelineViewData, today, stocksOrTimeline]);
  const deferredViewData = useDeferredValue(viewData);

  const renderModeMap = useRenderingModeSwitchContext();
  const isImmediate = renderModeMap.modes.get(yearmonth.toString()) === 'immediate';

  // animation
  const focusDate = useSharedValue<JsonLocalDate>(convertToJsonLocalDate(today.date));
  useEffect(() => {
    focusDate.value = convertToJsonLocalDate(today.date);
  }, [yearmonth]);

  return (
    <CategoryContext.Provider value={categoryQuery.data}>
      <ListView focusDate={focusDate} {...(isImmediate ? viewData : deferredViewData)} />
    </CategoryContext.Provider>
  );
}
export default withSuspense(MonthlyOverview);
