import React, { useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';

import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { numberFormat, numberFormatOnWorklet } from '@/src/presentation/i18n/format';
import { CostStock } from '@/src/presentation/usecase/query/projected-coststock/functions';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { useCategoryContext } from '../../context/CategoryContext';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type CategoryCostProps = {
  categoryId: string;
  stock: CostStock;
  focusDate: SharedValue<JsonLocalDate>;
};
function CategoryCost({ categoryId, stock, focusDate }: CategoryCostProps) {
  const categoryList = useCategoryContext();
  const category = categoryList.find((c) => c.category.id === categoryId)?.category;
  const dailyCosts = useMemo(() => {
    return stock.points.map((s) => ({ date: convertToJsonLocalDate(s.date), cost: s.value }));
  }, [stock]);

  //TODO: マウント時に一瞬文字が消えるのを修正
  const spendingTextProps = useAnimatedProps(() => {
    const index = dailyCosts.findIndex((d) => compareOnWorklet(d.date, focusDate.value) === 0);
    const safeIndex =
      index !== -1 ? index : compareOnWorklet(dailyCosts[0].date, focusDate.value) > 0 ? 0 : dailyCosts.length - 1;
    const text = numberFormatOnWorklet(dailyCosts[safeIndex].cost);
    const defaultValue = numberFormatOnWorklet(dailyCosts[safeIndex].cost);
    return { text, defaultValue };
  });

  const { styles } = useStyles(stylesheet);

  if (!category) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <CategoryIcon iconColor={category.iconColor} iconName={category.iconName} size={20} />
      </View>
      <Text style={styles.text}>{category.name}</Text>
      <View style={styles.rightArea}>
        <AnimatedInput
          style={styles.spending}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue={numberFormat(0)}
          animatedProps={spendingTextProps}
        />
        <Text style={styles.predicated}>/{dailyCosts[dailyCosts.length - 1].cost}</Text>
      </View>
    </View>
  );
}

export default React.memo(
  CategoryCost,
  (prev, next) => JSON.stringify(prev.stock) === JSON.stringify(next.stock) && prev.focusDate === next.focusDate,
);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.component.list.row.height.default,
    paddingHorizontal: theme.spacing.x4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background.layer1,
  },
  text: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.subHeading,
    marginLeft: theme.spacing.x3,
  },
  rightArea: {
    alignItems: 'flex-end',
  },
  spending: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.body,
    fontWeight: 700,
    textAlign: 'right',
  },
  predicated: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSize.caption,
  },
}));
