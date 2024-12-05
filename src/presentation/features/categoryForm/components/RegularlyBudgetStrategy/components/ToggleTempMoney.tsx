import React, { useEffect } from 'react';
import { Pressable } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import PlusSvg from '@/assets/icons/lucide/plus_2px.svg';
import { withAnimatedFc } from '@/src/presentation/components/hoc/withAniamtedFC';

import { useStoreContext } from '../../../context/StoreContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AniamtedPlusSvg = withAnimatedFc(PlusSvg);
type Props = { isActive: boolean };
function ToggleTempMoney({ isActive }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const { formStore } = useStoreContext();

  const transition = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => {
    const rotate = transition.value * 45;
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });
  const animatedContainerStyle = useAnimatedStyle(() => {
    const color = interpolateColor(transition.value, [0, 1], ['transparent', theme.colors.text.primary]);

    return {
      borderColor: color,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(transition.value, [0, 1], [theme.colors.text.tertiary, theme.colors.text.primary]);

    return {
      color,
    };
  });
  const animatedProps = useAnimatedProps(() => {
    const color = interpolateColor(transition.value, [0, 1], [theme.colors.text.tertiary, theme.colors.text.primary]);
    return { color };
  });

  useEffect(() => {
    if (isActive) {
      transition.value = withTiming(1);
    } else {
      transition.value = withTiming(0);
    }
  }, [isActive]);

  return (
    <AnimatedPressable
      style={[styles.container, animatedContainerStyle]}
      onPress={() => {
        formStore.toggleTempAmount();
      }}
    >
      <Animated.View style={animatedIconStyle}>
        <AniamtedPlusSvg width={theme.fontSize.subBody} height={theme.fontSize.subBody} animatedProps={animatedProps} />
      </Animated.View>
      <Animated.Text style={[styles.text, animatedTextStyle]}>一時予算</Animated.Text>
    </AnimatedPressable>
  );
}
export default React.memo(ToggleTempMoney);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.x2,
    paddingVertical: theme.spacing.x1,
    gap: theme.spacing.x2,
  },
  text: {
    color: theme.colors.brand.primary,
    fontSize: theme.fontSize.subBody,
  },
}));
