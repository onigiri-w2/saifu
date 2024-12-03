import { useDeferredValue, useEffect, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';
import { useSharedValue } from 'react-native-reanimated';
import { useSnapshot } from 'valtio';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { withSuspense } from '@/src/presentation/components/hoc/withSuspense';
import { queryOptions as categoryQueryOptions } from '@/src/presentation/usecase/query/budgeting-category/query-options';
import { queryOptions as stockQueryOptions } from '@/src/presentation/usecase/query/cost-stocks/query-options';
import { queryOptions as expenseQueryOptions } from '@/src/presentation/usecase/query/expense/query-options';
import { queryOptions } from '@/src/presentation/usecase/query/today/query-options';

import { costUsagePreferenceStore } from '../../store/preference.store';

import { useStocksWithCategory, useTimeline, useAggregatedStock } from './hooks';
import ListView from './ListView';
import NotFound from './NotFound';

type Props = {
  yearmonth: Yearmonth;
  useDeferredRender?: boolean;
};
function MonthlyOverview({ yearmonth, useDeferredRender = true }: Props) {
  // query
  const [categoryQuery, expenseQuery, stockQuery, todayQuery] = useSuspenseQueries({
    queries: [
      categoryQueryOptions.list(),
      expenseQueryOptions.monthly(yearmonth),
      stockQueryOptions.monthly(yearmonth),
      queryOptions.today(),
    ],
  });

  // data
  const stocksOrTimeline = useSnapshot(costUsagePreferenceStore).costOrTransaction;
  const stocks = useStocksWithCategory(stockQuery.data, categoryQuery.data);
  const timeline = useTimeline(expenseQuery.data, categoryQuery.data);
  const aggregatedStock = useAggregatedStock(stockQuery.data);
  const today = todayQuery.data;

  // validation
  if (stocks.length === 0 || !aggregatedStock) return <NotFound />;

  const viewData = useMemo(() => {
    return {
      stocks,
      aggregatedStock,
      timeline,
      today,
      stocksOrTimeline,
    };
  }, [stocks, aggregatedStock, timeline, today, stocksOrTimeline]);
  const deferredViewData = useDeferredValue(viewData);

  // animation
  const focusDate = useSharedValue(today.date.toDTO());
  useEffect(() => {
    focusDate.value = today.date.toDTO();
  }, [yearmonth]);

  return <ListView focusDate={focusDate} {...(useDeferredRender ? deferredViewData : viewData)} />;
}
export default withSuspense(MonthlyOverview);
