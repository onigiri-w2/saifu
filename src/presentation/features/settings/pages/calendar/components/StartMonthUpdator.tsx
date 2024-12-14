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
    (value: Day) => {
      const cycleStartDef = query.data?.cycleStartDef;
      if (!cycleStartDef) return;
      const newCycleStartDef = cycleStartDef.updateStartMonth(value);
      mutation.mutate({ cycleStartDef: newCycleStartDef });
      setStartMonth(value);
      onSelected?.();
    },
    [query.data],
  );

  const keyExtractor = useCallback((item: Day) => {
    return item.toString();
  }, []);
  const renderItem = useCallback(
    (item: ListRenderItemInfo<Day>) => {
      const day = item.item;
      return <Item value={day} label={`${item.item}日`} onPress={handleSelect} isActive={startMonth === item.item} />;
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
        length: theme.component.list.row.height.default,
        offset: (theme.component.list.row.height.default + theme.spacing.x3) * index,
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
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing['x6'],
    gap: theme.spacing.x3,
  },
}));
