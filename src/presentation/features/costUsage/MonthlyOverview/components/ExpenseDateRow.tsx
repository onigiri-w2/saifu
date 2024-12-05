import React from 'react';
import { Text } from 'react-native';

import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { compareOnWorklet } from '@/src/presentation/utils/reanimated/date.worklet';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

type Props = {
  date: JsonLocalDate;
  focusDate: SharedValue<JsonLocalDate>;
};
function ExpenseDateRow({ date, focusDate }: Props) {
  const label = `${date.month}月${date.day}日`;

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
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing.x1,
  },
  text: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.tertiary,
  },
}));
