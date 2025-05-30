import { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { DayOfWeek, dayOfWeekLabels, dayOfWeeks } from '@/src/domain/valueobject/types';
import { useCalendarMutation } from '@/src/presentation/usecase/mutation/calendar/mutation';
import { queryOptions } from '@/src/presentation/usecase/query';

import Item from './Item';

type Props = {
  initialStartWeek: DayOfWeek;
  onSelected?: () => void;
};
function StartWeekUpdater({ initialStartWeek, onSelected }: Props) {
  const { styles } = useStyles(stylesheet);
  const query = useQuery(queryOptions.calendar.loadCalendar());
  const [startWeek, setStartWeek] = useState(initialStartWeek);

  const queryClient = useQueryClient();
  const mutation = useCalendarMutation.update(queryClient);

  const handleSelect = useCallback(
    (v: DayOfWeek) => {
      const cycleStartDef = query.data?.cycleStartDef;
      if (!cycleStartDef) return;
      const newCycleStartDef = cycleStartDef.updateStartWeek(v);
      mutation.mutate({ cycleStartDef: newCycleStartDef });
      setStartWeek(v);
      onSelected?.();
    },
    [query.data],
  );

  const keyExtractor = useCallback((item: DayOfWeek) => {
    return item.toString();
  }, []);
  const renderItem = useCallback(
    (item: ListRenderItemInfo<DayOfWeek>) => {
      return (
        <Item
          value={item.item}
          label={`${dayOfWeekLabels[item.item]}曜日`}
          onPress={handleSelect}
          isActive={startWeek === item.item}
        />
      );
    },
    [startWeek],
  );

  return (
    <FlatList
      data={dayOfWeeks}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.content}
    />
  );
}
export default StartWeekUpdater;

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
