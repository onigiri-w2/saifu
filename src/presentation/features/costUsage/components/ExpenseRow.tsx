import React from 'react';
import { View, Text } from 'react-native';

import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Category from '@/src/domain/aggregation/category';
import Expense from '@/src/domain/aggregation/expense';
import { Month, Day } from '@/src/domain/valueobject/types';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { numberFormat } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

type Props = {
  category: Category;
  expense: Expense;
  focusDate: SharedValue<JsonLocalDate>;
};
function ExpenseRow({ category, expense, focusDate }: Props) {
  const { styles } = useStyles(stylesheet);
  const localDate = {
    year: expense.date.getFullYear(),
    month: (expense.date.getMonth() + 1) as Month,
    day: expense.date.getDate() as Day,
  };
  const containerStyle = useAnimatedStyle(() => {
    const isAfterThan = compareOnWorklet(localDate, focusDate.value) > 0;
    return {
      display: isAfterThan ? 'none' : 'flex',
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <CategoryIcon iconName={category.iconName} iconColor={category.iconColor} size={28} />
      <View style={styles.middle}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {expense.memo && <Text style={styles.memo}>{expense.memo}</Text>}
      </View>
      <Text style={styles.money}>{numberFormat(expense.amount.value)}</Text>
    </Animated.View>
  );
}
export default React.memo(ExpenseRow);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    height: 52,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.secondary,
    paddingHorizontal: theme.spacing.xl,
  },
  middle: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
  memo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  money: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
}));
