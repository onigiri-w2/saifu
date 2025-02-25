import React from 'react';
import { View, Text } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';

import CategoryIcon from '../../../shared/components/CategoryIcon';
import { useCategoriesContext } from '../../../shared/context/CategoriesContext';
import { MetricsKind } from '../../types';

import { DiffRowBar, DiffRowBody } from './components/diff';
import { EntirlyRowBar, EntirlyRowBody } from './components/entirly';
import { TodayRowBar, TodayRowBody } from './components/today';

type Props = {
  metrics: ActiveBudgetMetrics;
  kind: MetricsKind;
};
function MetricsRow({ metrics, kind }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const categories = useCategoriesContext();
  const category = categories.find((c) => c.id.value === metrics.categoryIds[0]);

  if (category === undefined) return null;

  const body =
    kind === 'entirly' ? (
      <EntirlyRowBody metrics={metrics} />
    ) : kind === 'today' ? (
      <TodayRowBody metrics={metrics} />
    ) : (
      <DiffRowBody metrics={metrics} />
    );

  const bar =
    kind === 'entirly' ? (
      <EntirlyRowBar metrics={metrics} />
    ) : kind === 'today' ? (
      <TodayRowBar metrics={metrics} />
    ) : (
      <DiffRowBar metrics={metrics} />
    );

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <CategoryIcon
          iconName={category.iconName}
          iconColor={category.iconColor}
          size={theme.component.list.row.iconSize.large}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <View style={styles.contentValueWrap}>
          {body}
          {bar}
        </View>
      </View>
    </View>
  );
}
export default React.memo(MetricsRow, (prev, next) => {
  return JSON.stringify(prev.metrics) === JSON.stringify(next.metrics);
});

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: theme.component.list.row.height.default,
    gap: theme.spacing.x4,
  },
  iconWrap: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.layer1,
    borderRadius: theme.radius.default,
  },
  content: {
    flex: 1,
    haeight: '100%',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.primary,
  },
  contentValueWrap: {
    gap: theme.spacing.xhalf,
  },
}));
