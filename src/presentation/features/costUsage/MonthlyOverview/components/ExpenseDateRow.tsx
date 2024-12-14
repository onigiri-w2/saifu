import React from 'react';
import { Text } from 'react-native';

import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';
import { isEqualDate } from '@/src/utils/dates';

import { useTodayContext } from '../../context/TodayContext';

type Props = {
  date: JsonLocalDate;
  focusDate: SharedValue<JsonLocalDate>;
};
function ExpenseDateRow({ date, focusDate }: Props) {
  const today = useTodayContext();
  const jsonToday = convertToJsonLocalDate(today.date);
  const label = isEqualDate(date, jsonToday) ? '今日' : `${date.month}月${date.day}日`;

  const animationStyle = useAnimatedStyle(() => {
    const isAfterThan = compareOnWorklet(date, focusDate.value) > 0;
    return {
      display: isAfterThan ? 'none' : 'flex',
    };
  });

  const { styles } = useStyles(stylesheet);
  return (
    <Animated.View style={[animationStyle, styles.container]}>
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

export default React.memo(
  ExpenseDateRow,
  (prev, next) => JSON.stringify(prev.date) === JSON.stringify(next.date) && prev.focusDate === next.focusDate,
);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.layer1,
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing.x1,
  },
  text: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.tertiary,
  },
}));
