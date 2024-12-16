import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { CategorizedActiveBudgetMetrics } from '@/src/presentation/usecase/query/budget-metrics/functions';

import PeriodRow from '../row/periodRow';

type Props = {
  allMetrics: CategorizedActiveBudgetMetrics[];
  scrollEnabled?: boolean;
};
function ListView({ allMetrics, scrollEnabled = false }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<CategorizedActiveBudgetMetrics>) => {
    return <PeriodRow metrics={item.item} />;
  }, []);
  const keyExtractor = useCallback((item: CategorizedActiveBudgetMetrics) => item.categoryId, []);
  const { styles, theme } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={allMetrics}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentInset={{ top: theme.spacing.x8, bottom: theme.spacing.x8 }}
      scrollEnabled={scrollEnabled}
    />
  );
}
export default React.memo(ListView);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    gap: theme.spacing.x6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
}));
