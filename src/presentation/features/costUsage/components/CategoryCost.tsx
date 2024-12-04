import React, { useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';

import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Category from '@/src/domain/aggregation/category';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { numberFormat, numberFormatOnWorklet } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type CategoryCostProps = {
  category: Category;
  stock: DailyStock;
  focusDate: SharedValue<JsonLocalDate>;
};
function CategoryCost({ category, stock, focusDate }: CategoryCostProps) {
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

export default React.memo(CategoryCost);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: theme.spacing.xl,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.layer2,
  },
  text: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.lg,
    marginLeft: theme.spacing.lg,
  },
  rightArea: {
    alignItems: 'flex-end',
  },
  spending: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
    fontWeight: 700,
    textAlign: 'right',
  },
  predicated: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSize.xs,
  },
}));
