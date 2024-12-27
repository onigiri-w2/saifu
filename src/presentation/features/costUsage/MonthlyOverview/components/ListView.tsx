import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Expense from '@/src/domain/aggregation/expense';
import Today from '@/src/domain/aggregation/today';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import LocalDate from '@/src/domain/valueobject/localdate';
import { CategorizedProjectedCost } from '@/src/presentation/usecase/query/projected-cost/functions';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { TimelineViewData } from '../../types';

import CategoryCost from './CategoryCost';
import DateRow from './ExpenseDateRow';
import ExpenseRow from './ExpenseRow';
import Header from './Header';
import NotFoundCategories from './NotFoundCategories';
import NotFoundExpenses from './NotFoundExpenses';

type Props = {
  costs: CategorizedProjectedCost[];
  aggregatedCost: DailyTimeSeries;
  timeline: TimelineViewData;
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
  stocksOrTimeline: 'cost' | 'transaction';
};
function ListView({ costs: stocks, aggregatedCost, timeline, today, focusDate, stocksOrTimeline }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<CategorizedProjectedCost | Expense | LocalDate>) => {
    if (item.item instanceof LocalDate) {
      return <DateRow date={convertToJsonLocalDate(item.item)} focusDate={focusDate} />;
    } else if (item.item instanceof Expense) {
      return <ExpenseRow expense={item.item} focusDate={focusDate} />;
    } else {
      return <CategoryCost categoryId={item.item.categoryId} cost={item.item.cost} focusDate={focusDate} />;
    }
  }, []);

  const keyExtractor = useCallback((item: CategorizedProjectedCost | Expense | LocalDate) => {
    if (item instanceof LocalDate) return item.toString();
    if (item instanceof Expense) return item.id.value;
    return item.categoryId.value;
  }, []);

  const { styles, theme } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      data={stocksOrTimeline === 'cost' ? stocks : timeline}
      renderItem={renderItem}
      ListHeaderComponent={<Header cost={aggregatedCost} today={today} focusDate={focusDate} />}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInset={{ bottom: theme.spacing.x6 }}
      ListFooterComponent={
        stocksOrTimeline === 'transaction' ? (
          <NotFoundExpenses period={aggregatedCost.getPeriod()} timeline={timeline} focusDate={focusDate} />
        ) : (
          <NotFoundCategories existAtLeastOne={stocks.length > 0} />
        )
      }
    />
  );
}

export default ListView;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: theme.spacing.x6,
  },
}));
