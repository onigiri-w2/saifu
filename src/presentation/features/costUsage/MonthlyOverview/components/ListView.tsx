import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Expense from '@/src/domain/aggregation/expense';
import Today from '@/src/domain/aggregation/today';
import LocalDate from '@/src/domain/valueobject/localdate';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import { CostStock } from '@/src/presentation/usecase/query/cost-stocks/functions';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { TimelineViewData } from '../../types';

import CategoryCost from './CategoryCost';
import DateRow from './ExpenseDateRow';
import ExpenseRow from './ExpenseRow';
import Header from './Header';

type Props = {
  stocks: CostStock[];
  aggregatedStock: DailyStock;
  timeline: TimelineViewData;
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
  stocksOrTimeline: 'cost' | 'transaction';
};
function ListView({ stocks, aggregatedStock, timeline, today, focusDate, stocksOrTimeline }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<CostStock | Expense | LocalDate>) => {
    if (item.item instanceof LocalDate) {
      return <DateRow date={convertToJsonLocalDate(item.item)} focusDate={focusDate} />;
    } else if (item.item instanceof Expense) {
      return <ExpenseRow expense={item.item} focusDate={focusDate} />;
    } else {
      return <CategoryCost stock={item.item} focusDate={focusDate} />;
    }
  }, []);

  const keyExtractor = useCallback((item: CostStock | Expense | LocalDate) => {
    if (item instanceof LocalDate) return item.toString();
    if (item instanceof Expense) return item.id;
    return item.categoryId;
  }, []);

  const { styles, theme } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      data={stocksOrTimeline === 'cost' ? stocks : timeline}
      renderItem={renderItem}
      ListHeaderComponent={<Header stock={aggregatedStock} today={today} focusDate={focusDate} />}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentInset={{ top: theme.spacing.x3 }}
    />
  );
}

export default ListView;

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
}));
