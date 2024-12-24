import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { CategorizedActiveBudgetMetrics } from '@/src/presentation/usecase/query/budget-metrics/functions';

import Row from './Row';

type Props = {
  allMetrics: CategorizedActiveBudgetMetrics[];
};
function ListView({ allMetrics }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<CategorizedActiveBudgetMetrics>) => {
    return <Row metrics={item.item} />;
  }, []);
  const keyExtractor = useCallback((item: CategorizedActiveBudgetMetrics) => item.categoryId, []);
  const { styles } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={allMetrics}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEnabled={false}
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
  },
}));
