import { useCallback, useEffect } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useSuspenseQueries } from '@tanstack/react-query';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import LocalDate, { isLocalDateDTO, LocalDateDTO } from '@/src/domain/valueobject/localdate';
import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { withSuspense } from '@/src/presentation/components/hoc/withSuspense';
import { queryOptions as categoryQueryOptions } from '@/src/presentation/usecase/query/budgeting-category/query-options';
import { queryOptions as stockQueryOptions } from '@/src/presentation/usecase/query/cost-stocks/query-options';
import { queryOptions as expenseQueryOptions } from '@/src/presentation/usecase/query/expense/query-options';
import { queryOptions } from '@/src/presentation/usecase/query/today/query-options';

import { costUsagePreferenceStore } from '../../store/preference.store';
import { ExpenseWithCategory, isExpenseWithCategory, StockWithCategory } from '../../types';
import CategoryCost from '../CategoryCost';
import ExpenseDateRow from '../ExpenseDateRow';
import ExpenseRow from '../ExpenseRow';

import Header from './Header';
import { useAggregatedStock, useGroupedExpensesByDate, useStocksWithCategory } from './hooks';
import NotFound from './NotFound';

type Props = {
  yearmonth: Yearmonth;
};
function MonthlyCostOverview({ yearmonth }: Props) {
  // state
  const [categoryQuery, expenseQuery, stockQuery, todayQuery] = useSuspenseQueries({
    queries: [
      categoryQueryOptions.list(),
      expenseQueryOptions.monthly(yearmonth),
      stockQueryOptions.monthly(yearmonth),
      queryOptions.today(),
    ],
  });
  const preference = useSnapshot(costUsagePreferenceStore);

  // memo
  const stocks = useStocksWithCategory(stockQuery.data, categoryQuery.data);
  const groupedExpensesByDate = useGroupedExpensesByDate(expenseQuery.data, categoryQuery.data);
  const aggregatedStock = useAggregatedStock(stockQuery.data);
  const today = todayQuery.data;

  // validation
  if (stocks.length === 0 || !aggregatedStock) return <NotFound />;

  // animation
  const focusDate = useSharedValue(today.date.toDTO());
  useEffect(() => {
    focusDate.value = today.date.toDTO();
  }, [yearmonth]);

  const { keyExtractor, renderItem } = useFlatlistProps(focusDate);
  const { styles } = useStyles(stylesheet);
  return (
    <FlatList
      style={styles.container}
      data={preference.costOrTransaction === 'cost' ? stocks : groupedExpensesByDate}
      ListHeaderComponent={<Header stock={aggregatedStock} focusDate={focusDate} today={today} />}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
}
export default withSuspense(MonthlyCostOverview);

const useFlatlistProps = (focusDate: SharedValue<LocalDateDTO>) => {
  const renderItem = useCallback((item: ListRenderItemInfo<StockWithCategory | ExpenseWithCategory | LocalDate>) => {
    if (isLocalDateDTO(item.item)) return <ExpenseDateRow date={item.item} focusDate={focusDate} />;
    if (isExpenseWithCategory(item.item)) {
      return <ExpenseRow category={item.item.category} expense={item.item.expense} focusDate={focusDate} />;
    }
    return <CategoryCost category={item.item.category} stock={item.item.stock} focusDate={focusDate} />;
  }, []);

  const keyExtractor = useCallback((item: StockWithCategory | ExpenseWithCategory | LocalDate) => {
    if (isLocalDateDTO(item)) return item.day.toString();
    if (isExpenseWithCategory(item)) return item.expense.id;
    return item.category.id;
  }, []);

  return {
    renderItem,
    keyExtractor,
  };
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
}));
