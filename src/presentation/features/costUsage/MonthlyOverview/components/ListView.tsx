import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Expense from '@/src/domain/aggregation/expense';
import Today from '@/src/domain/aggregation/today';
import LocalDate from '@/src/domain/valueobject/localdate';
import { CategorizedCostStock, CostStock } from '@/src/presentation/usecase/query/projected-coststock/functions';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { TimelineViewData } from '../../types';

import CategoryCost from './CategoryCost';
import DateRow from './ExpenseDateRow';
import ExpenseRow from './ExpenseRow';
import Header from './Header';
import NotFoundCategories from './NotFoundCategories';
import NotFoundExpenses from './NotFoundExpenses';

type Props = {
  stocks: CategorizedCostStock[];
  aggregatedStock: CostStock;
  timeline: TimelineViewData;
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
  stocksOrTimeline: 'cost' | 'transaction';
};
function ListView({ stocks, aggregatedStock, timeline, today, focusDate, stocksOrTimeline }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<CategorizedCostStock | Expense | LocalDate>) => {
    if (item.item instanceof LocalDate) {
      return <DateRow date={convertToJsonLocalDate(item.item)} focusDate={focusDate} />;
    } else if (item.item instanceof Expense) {
      return <ExpenseRow expense={item.item} focusDate={focusDate} />;
    } else {
      return <CategoryCost categoryId={item.item.categoryId} stock={item.item.stock} focusDate={focusDate} />;
    }
  }, []);

  const keyExtractor = useCallback((item: CategorizedCostStock | Expense | LocalDate) => {
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
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInset={{ bottom: theme.spacing.x6 }}
      ListFooterComponent={
        stocksOrTimeline === 'transaction' ? (
          <NotFoundExpenses period={aggregatedStock.period} timeline={timeline} focusDate={focusDate} />
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
