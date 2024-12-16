import React from 'react';
import { View, Text } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { CategorizedActiveBudgetMetrics } from '@/src/presentation/usecase/query/budget-metrics/functions';

import { useCategoryContext } from '../../context/CategoryContext';

type Props = {
  metrics: CategorizedActiveBudgetMetrics;
};
function Row({ metrics }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const categories = useCategoryContext();
  const category = categories.find((c) => c.category.id === metrics.categoryId)?.category;

  if (category === undefined) return null;

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
      </View>
      <Text>{metrics.metrics.today.money.budget}</Text>
      <Text>{metrics.metrics.today.money.spending}</Text>
      <Text>{metrics.metrics.period.money.budget}</Text>
    </View>
  );
}
export default React.memo(Row, (prev, next) => {
  return JSON.stringify(prev.metrics) === JSON.stringify(next.metrics);
});

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: theme.component.list.row.height.default,
    gap: theme.spacing.x4,
    paddingHorizontal: theme.spacing.x4,
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
    height: '100%',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.primary,
  },
}));
