import { useMemo } from 'react';
import { TextInput, View } from 'react-native';

import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { LocalDateDTO } from '@/src/domain/valueobject/localdate';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import { numberFormatOnWorklet } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/date.worklet';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  stock: DailyStock;
  focusDate: SharedValue<LocalDateDTO>;
};
function MonthlyCostHeader({ stock, focusDate }: Props) {
  const dailyCosts = useMemo(() => {
    return stock.points.map((s) => ({ date: s.date.toDTO(), cost: s.value }));
  }, [stock]);

  const costTextProps = useAnimatedProps(() => {
    const index = dailyCosts.findIndex((d) => compareOnWorklet(d.date, focusDate.value) === 0);
    const safeIndex =
      index !== -1 ? index : compareOnWorklet(dailyCosts[0].date, focusDate.value) > 0 ? 0 : dailyCosts.length - 1;
    const value = numberFormatOnWorklet(dailyCosts[safeIndex].cost);
    return {
      text: value,
      defaultValue: value,
    };
  });

  const dateRangeTextProps = useAnimatedProps(() => {
    const index = dailyCosts.findIndex((d) => compareOnWorklet(d.date, focusDate.value) === 0);
    const safeIndex =
      index !== -1 ? index : compareOnWorklet(dailyCosts[0].date, focusDate.value) > 0 ? 0 : dailyCosts.length - 1;
    const start = formatDateOnWorklet(dailyCosts[0].date);
    const end = formatDateOnWorklet(dailyCosts[safeIndex].date);
    const text = `${start} - ${end}`;
    return { text, defaultValue: text };
  });

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <AnimatedInput
        style={styles.dates}
        animatedProps={dateRangeTextProps}
        underlineColorAndroid="transparent"
        editable={false}
      />
      <AnimatedInput
        style={styles.cost}
        animatedProps={costTextProps}
        underlineColorAndroid="transparent"
        editable={false}
      />
    </View>
  );
}
export default MonthlyCostHeader;

const formatDateOnWorklet = (date: LocalDateDTO) => {
  'worklet';
  return `${date.month}/${date.day}`;
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dates: {
    fontSize: theme.fontSize['2xs'],
    color: theme.colors.text.tertiary,
  },
  cost: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
}));
