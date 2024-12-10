import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Expense from '@/src/domain/aggregation/expense';
import { Month, Day } from '@/src/domain/valueobject/types';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { numberFormat } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { useActionsContext } from '../../context/ActionsContext';
import { useCategoryContext } from '../../context/CategoryContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
type Props = {
  expense: Expense;
  focusDate: SharedValue<JsonLocalDate>;
};
function ExpenseRow({ expense, focusDate }: Props) {
  const { styles } = useStyles(stylesheet);
  const categoryList = useCategoryContext();
  const category = categoryList.find((c) => c.category.id === expense.categoryId)?.category;
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

  const actions = useActionsContext();
  const handlePress = () => {
    actions.onSelectExpenseItem?.(expense.id);
  };

  if (!category) return null;

  return (
    <AnimatedTouchableOpacity style={[styles.container, containerStyle]} onPress={handlePress}>
      <CategoryIcon iconName={category.iconName} iconColor={category.iconColor} size={28} />
      <View style={styles.middle}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {expense.memo && <Text style={styles.memo}>{expense.memo}</Text>}
      </View>
      <Text style={styles.money}>{numberFormat(expense.amount.value)}</Text>
    </AnimatedTouchableOpacity>
  );
}
export default React.memo(ExpenseRow);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.x3,
    height: theme.component.list.row.height.default,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.secondary,
    paddingHorizontal: theme.spacing.x4,
  },
  middle: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
  memo: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.tertiary,
  },
  money: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
}));
