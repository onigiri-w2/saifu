import React from 'react';
import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BudgetPlan from '@/src/domain/model/aggregation/budgetPlan';
import TransactionCategory from '@/src/domain/model/aggregation/transactionCategory';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

import { ExtendedCategory } from '../../types';

type Props = {
  extendedCategory: ExtendedCategory;
};
function CategoryRow({ extendedCategory }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const { category, budgetPlan } = extendedCategory;

  return (
    <View style={styles.container}>
      <View style={styles.categoryWrap}>
        <CategoryIcon
          iconName={category.iconName}
          iconColor={category.iconColor}
          size={theme.component.list.row.iconSize.middle}
        />
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
      <View style={styles.budgetPlanWrap}>
        <Text>{generateBudgetLabel(category, budgetPlan)}</Text>
      </View>
    </View>
  );
}

const generateBudgetLabel = (category: TransactionCategory, budgetPlan?: BudgetPlan) => {
  if (budgetPlan === undefined) return undefined;
  return '予算あり';
};

export default React.memo(CategoryRow, (prev, next) => {
  return JSON.stringify(prev.extendedCategory) === JSON.stringify(next.extendedCategory);
});

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: theme.component.list.row.height.default,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.x4,
  },
  categoryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.x2,
  },
  categoryName: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
  budgetPlanWrap: {
    alignItems: 'flex-end',
    gap: theme.spacing.x1,
  },
  budgetPlanLabel: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.tertiary,
  },
  budgetPlanValue: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.primary,
  },
}));
