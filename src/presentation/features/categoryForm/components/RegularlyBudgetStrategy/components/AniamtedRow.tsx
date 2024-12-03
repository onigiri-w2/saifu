import React, { useEffect } from 'react';

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ROW_HEIGHT } from '../constants';

type Props = {
  isActive: boolean;
  children: React.ReactNode;
};
function AnimatedRow({ isActive, children }: Props) {
  const height = useSharedValue(isActive ? ROW_HEIGHT : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      overflow: 'hidden',
    };
  });

  useEffect(() => {
    if (isActive) {
      height.value = withTiming(ROW_HEIGHT);
    } else {
      height.value = withTiming(0);
    }
  }, [isActive]);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
export default React.memo(AnimatedRow);
