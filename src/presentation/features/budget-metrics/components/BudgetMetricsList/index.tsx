import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';

import { CategoriesContext } from '../../../shared/context/CategoriesContext';
import { MetricsKind } from '../../types';
import BudgetMetricsListRow from '../BudgetMetricsRow';

import { useMetrics } from './hooks';

type Props = {
  useDeferredRendering: boolean;
  kind: MetricsKind;
};
function ListView({ useDeferredRendering, kind }: Props) {
  const { metrics, categories } = useMetrics(useDeferredRendering);
  const renderItem = useCallback(
    (item: ListRenderItemInfo<ActiveBudgetMetrics>) => {
      return <BudgetMetricsListRow metrics={item.item} kind={kind} />;
    },
    [kind],
  );
  const keyExtractor = useCallback((item: ActiveBudgetMetrics) => item.budgetPlanId, []);
  const { styles } = useStyles(stylesheet);

  return (
    <CategoriesContext.Provider value={categories}>
      <FlatList
        scrollEnabled={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={metrics}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </CategoriesContext.Provider>
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
