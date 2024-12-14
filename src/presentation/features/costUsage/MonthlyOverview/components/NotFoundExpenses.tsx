import React from 'react';
import { Text, TextInput } from 'react-native';

import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';
import { dateFormatOnWorklet } from '@/src/presentation/i18n/format';
import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { TimelineViewData } from '../../types';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  period: Period;
  timeline: TimelineViewData;
  focusDate: SharedValue<JsonLocalDate>;
};
function NotFoundExpenses({ period, timeline, focusDate }: Props) {
  const periodDates = period.genArray().map((d) => convertToJsonLocalDate(d));

  const timelineDates = timeline.filter((v): v is LocalDate => v instanceof LocalDate).sort((a, b) => a.compare(b));
  const minDateOfTimeline = timelineDates[0] !== undefined ? convertToJsonLocalDate(timelineDates[0]) : undefined;

  const animatedStyle = useAnimatedStyle(() => {
    if (minDateOfTimeline === undefined) return { display: 'flex' };

    const display = compareOnWorklet(focusDate.value, minDateOfTimeline) < 0 ? 'flex' : 'none';
    return { display };
  });

  const index = useDerivedValue(() => {
    const index = periodDates.findIndex((d) => compareOnWorklet(d, focusDate.value) === 0);
    const safeIndex =
      index !== -1 ? index : compareOnWorklet(periodDates[0], focusDate.value) > 0 ? 0 : periodDates.length - 1;
    return safeIndex;
  });
  const dateRangeTextProps = useAnimatedProps(() => {
    const start = dateFormatOnWorklet(periodDates[0]);
    const end = dateFormatOnWorklet(periodDates[index.value]);
    const text = `${start} - ${end}`;
    return { text, defaultValue: text };
  });

  const { styles } = useStyles(stylesheet);

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <AnimatedInput
        style={styles.subText}
        underlineColorAndroid="transparent"
        editable={false}
        animatedProps={dateRangeTextProps}
      />
      <Text style={styles.text}>この期間に支出の記録はありません</Text>
    </Animated.View>
  );
}
export default React.memo(NotFoundExpenses);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    borderRadius: theme.radius.default,
    marginHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing.x12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.body,
  },
  subText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.caption,
    marginBottom: theme.spacing.x1,
  },
}));
