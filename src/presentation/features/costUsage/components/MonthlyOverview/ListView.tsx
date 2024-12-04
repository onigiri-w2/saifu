import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Today from '@/src/domain/aggregation/today';
import LocalDate from '@/src/domain/valueobject/localdate';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { ExpenseViewData, StockViewData, isExpenseViewData } from '../../types';
import CategoryCost from '../CategoryCost';
import DateRow from '../ExpenseDateRow';
import ExpenseRow from '../ExpenseRow';

import Header from './Header';

type Props = {
  stocks: StockViewData[];
  aggregatedStock: DailyStock;
  timeline: (ExpenseViewData | LocalDate)[];
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
  stocksOrTimeline: 'cost' | 'transaction';
};
function ListView({ stocks, aggregatedStock, timeline, today, focusDate, stocksOrTimeline }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<StockViewData | ExpenseViewData | LocalDate>) => {
    if (item.item instanceof LocalDate) {
      return <DateRow date={item.item} focusDate={focusDate} />;
    } else if (isExpenseViewData(item.item)) {
      return <ExpenseRow category={item.item.category} expense={item.item.expense} focusDate={focusDate} />;
    } else {
      return <CategoryCost category={item.item.category} stock={item.item.stock} focusDate={focusDate} />;
    }
  }, []);

  const keyExtractor = useCallback((item: StockViewData | ExpenseViewData | LocalDate) => {
    if (item instanceof LocalDate) return item.day.toString();
    if (isExpenseViewData(item)) return item.expense.id;
    return item.category.id;
  }, []);

  const { styles } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      data={stocksOrTimeline === 'cost' ? stocks : timeline}
      renderItem={renderItem}
      ListHeaderComponent={<Header stock={aggregatedStock} today={today} focusDate={focusDate} />}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default ListView;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
}));
