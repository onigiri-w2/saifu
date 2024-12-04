import { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Day, days } from '@/src/domain/valueobject/types';
import { useCalendarMutation } from '@/src/presentation/usecase/mutation/calendar/mutation';
import { queryOptions } from '@/src/presentation/usecase/query';

import Item from './Item';

type Props = {
  initialStartMonth: Day;
  onSelected?: () => void;
};
function StartMonthUpdater({ initialStartMonth, onSelected }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const query = useQuery(queryOptions.calendar.loadCalendar());
  const [startMonth, setStartMonth] = useState(initialStartMonth);

  const queryClient = useQueryClient();
  const mutation = useCalendarMutation.update(queryClient);

  const handleSelect = useCallback(
    (v: string) => {
      const cycleStartDef = query.data?.cycleStartDef;
      if (!cycleStartDef) return;
      const newStartMonth = parseInt(v, 10) as Day;
      const newCycleStartDef = cycleStartDef.updateStartMonth(newStartMonth);
      mutation.mutate({ cycleStartDef: newCycleStartDef });
      setStartMonth(newStartMonth);
      onSelected?.();
    },
    [query.data],
  );

  const keyExtractor = useCallback((item: Day) => {
    return item.toString();
  }, []);
  const renderItem = useCallback(
    (item: ListRenderItemInfo<Day>) => {
      return (
        <Item
          value={item.item.toString()}
          label={`${item.item}日`}
          onPress={handleSelect}
          isActive={startMonth === item.item}
        />
      );
    },
    [startMonth],
  );

  return (
    <FlatList
      data={days}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.content}
      initialScrollIndex={startMonth - 1}
      getItemLayout={(_, index) => ({
        length: 52,
        offset: (52 + theme.spacing.lg) * index,
        index,
      })}
      ListFooterComponent={<View style={{ height: 200 }} />}
    />
  );
}
export default StartMonthUpdater;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['3xl'],
    gap: theme.spacing.lg,
  },
}));
