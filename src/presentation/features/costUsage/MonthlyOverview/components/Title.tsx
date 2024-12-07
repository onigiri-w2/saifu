import { useMemo } from 'react';
import { TextInput, View } from 'react-native';

import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { DailyStock } from '@/src/domain/valueobject/timeseries';
import { numberFormatOnWorklet } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  stock: DailyStock;
  focusDate: SharedValue<JsonLocalDate>;
};
function Title({ stock, focusDate }: Props) {
  const dailyCosts = useMemo(() => {
    return stock.points.map((s) => ({ date: convertToJsonLocalDate(s.date), cost: s.value }));
  }, [stock]);
  const { styles, theme } = useStyles(stylesheet);

  const index = useDerivedValue(() => {
    const index = dailyCosts.findIndex((d) => compareOnWorklet(d.date, focusDate.value) === 0);
    const safeIndex =
      index !== -1 ? index : compareOnWorklet(dailyCosts[0].date, focusDate.value) > 0 ? 0 : dailyCosts.length - 1;
    return safeIndex;
  });

  const costTextProps = useAnimatedProps(() => {
    const value = dailyCosts[index.value].cost;
    const label = numberFormatOnWorklet(value > 0 ? -value : 0);
    return {
      text: label,
      defaultValue: label,
    };
  });

  const costTextStyles = useAnimatedStyle(() => {
    const isZero = dailyCosts[index.value].cost === 0;
    return { color: isZero ? theme.colors.text.primary : theme.colors.status.error };
  });

  const dateRangeTextProps = useAnimatedProps(() => {
    const start = formatDateOnWorklet(dailyCosts[0].date);
    const end = formatDateOnWorklet(dailyCosts[index.value].date);
    const text = `${start} - ${end}`;
    return { text, defaultValue: text };
  });

  return (
    <View style={styles.container}>
      <AnimatedInput
        style={styles.dates}
        animatedProps={dateRangeTextProps}
        underlineColorAndroid="transparent"
        editable={false}
      />
      <AnimatedInput
        style={[styles.cost, costTextStyles]}
        animatedProps={costTextProps}
        underlineColorAndroid="transparent"
        editable={false}
      />
    </View>
  );
}
export default Title;

const formatDateOnWorklet = (date: JsonLocalDate) => {
  'worklet';
  return `${date.month}/${date.day}`;
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dates: {
    fontSize: theme.fontSize.subCaption,
    color: theme.colors.text.tertiary,
  },
  cost: {
    fontSize: theme.fontSize.subTitle,
    fontWeight: 'bold',
    marginBottom: theme.spacing.x1,
  },
}));
