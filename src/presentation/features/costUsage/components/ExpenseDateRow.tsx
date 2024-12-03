import React from 'react';
import { Text } from 'react-native';

import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { LocalDateDTO } from '@/src/domain/valueobject/localdate';
import { compareOnWorklet } from '@/src/presentation/utils/date.worklet';

type Props = {
  date: LocalDateDTO;
  focusDate: SharedValue<LocalDateDTO>;
};
function ExpenseDateRow({ date, focusDate }: Props) {
  // TODO: 表示の調整
  const label = `${date.month + 1}月${date.day}日`;

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

export default React.memo(ExpenseDateRow);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.ground,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
}));
