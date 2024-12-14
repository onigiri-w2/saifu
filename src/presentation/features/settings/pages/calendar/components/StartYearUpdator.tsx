import { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Month, months } from '@/src/domain/valueobject/types';
import { useCalendarMutation } from '@/src/presentation/usecase/mutation/calendar/mutation';
import { queryOptions } from '@/src/presentation/usecase/query';

import Item from './Item';

type Props = {
  initialStartYear: Month;
  onSelected?: () => void;
};
function StartYearUpdater({ initialStartYear, onSelected }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const query = useQuery(queryOptions.calendar.loadCalendar());
  const [startYear, setStartYear] = useState(initialStartYear);

  const queryClient = useQueryClient();
  const mutation = useCalendarMutation.update(queryClient);

  const handleSelect = useCallback(
    (v: Month) => {
      const cycleStartDef = query.data?.cycleStartDef;
      if (!cycleStartDef) return;
      const newCycleStartDef = cycleStartDef.updateStartYear(v);
      mutation.mutate({ cycleStartDef: newCycleStartDef });
      setStartYear(v);
      onSelected?.();
    },
    [query.data],
  );

  const keyExtractor = useCallback((item: Month) => {
    return item.toString();
  }, []);
  const renderItem = useCallback(
    (item: ListRenderItemInfo<Month>) => {
      return (
        <Item value={item.item} label={`${item.item}月`} onPress={handleSelect} isActive={startYear === item.item} />
      );
    },
    [startYear],
  );

  return (
    <FlatList
      data={months}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.content}
      initialScrollIndex={startYear - 1}
      getItemLayout={(_, index) => ({
        length: theme.component.list.row.height.default,
        offset: (theme.component.list.row.height.default + theme.spacing.x3) * index,
        index,
      })}
      ListFooterComponent={<View style={{ height: 200 }} />}
    />
  );
}
export default StartYearUpdater;

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
