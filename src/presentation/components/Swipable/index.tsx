import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TapHighlight from './components/TouchableHighlight';

export type SwipeableRef = {
  close: () => void;
  isOpen: () => boolean;
};
type Props = {
  onPress?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  leftThreshold?: number;
  rightThreshold?: number;
  righActions?: React.ReactNode;
  children: React.ReactNode;
};
export const Swipeable = React.memo(
  forwardRef<SwipeableRef, Props>(
    (
      {
        children,
        righActions,
        onPress,
        onOpen,
        onClose,
        leftThreshold = DEFAULT_LEFT_THRESHOLD,
        rightThreshold = DEFAULT_RIGHT_THRESHOLD,
      },
      ref,
    ) => {
      const startX = useSharedValue(0);
      const animX = useSharedValue(0);
      const panGesture = Gesture.Pan()
        .activeOffsetX([-GESTURE_CONFIG.DIRECTIONAL_OFFSET, GESTURE_CONFIG.DIRECTIONAL_OFFSET]) // 横方向に10px以上動いたらジェスチャ開始
        .failOffsetY([-GESTURE_CONFIG.DIRECTIONAL_OFFSET, GESTURE_CONFIG.DIRECTIONAL_OFFSET]) // 縦方向に10px以上動いたらジェスチャ失敗
        .onStart(() => {
          startX.value = animX.value;
        })
        .onChange((e) => {
          animX.value = e.translationX + startX.value;
        })
        .onEnd((e) => {
          // velocityFactor=0.6にしてる。velocity高すぎても変だから。
          const velocityFactor = 0.6;
          const velocity = e.velocityX * velocityFactor;

          if (Math.sign(velocity) === -1) {
            // Swipe left
            animX.value = withSpring(leftThreshold, {
              velocity,
              ...SPRING_CONFIG,
            });
          } else {
            // Return to start
            animX.value = withSpring(rightThreshold, {
              velocity: velocity * 0.5,
              ...SPRING_CONFIG,
            });
          }
        });
      const tapEnabled = useDerivedValue(() => {
        return Math.abs(animX.value) < GESTURE_CONFIG.TAP_THRESHOLD;
      });

      const { styles } = useStyles(stylesheet);
      const animatedForegroundStyle = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: animX.value }],
        };
      });
      const animatedRightActionsStyle = useAnimatedStyle(() => {
        return {
          width: Math.max(0, -animX.value),
        };
      });

      useAnimatedReaction(
        () => {
          return tapEnabled.value;
        },
        (current, previous) => {
          if (!current && previous) {
            onOpen && runOnJS(onOpen)();
          }
          if (current && !previous) {
            onClose && runOnJS(onClose)();
          }
        },
        [tapEnabled],
      );

      useImperativeHandle(ref, () => ({
        close: () => {
          // animX.value = withTiming(rightThreshold, { duration: 300, easing: Easing.inOut(Easing.ease) });
          animX.value = withSpring(rightThreshold, {
            velocity: 0.5,
            ...SPRING_CONFIG,
          });
        },
        isOpen: () => {
          return !tapEnabled.value;
        },
      }));

      return (
        <GestureDetector gesture={panGesture}>
          <View>
            <Animated.View style={animatedForegroundStyle}>
              <TapHighlight gesture={panGesture} onPress={onPress} enabled={tapEnabled}>
                {children}
              </TapHighlight>
            </Animated.View>
            {righActions && (
              <Animated.View style={[animatedRightActionsStyle, styles.righActionsLayer]}>{righActions}</Animated.View>
            )}
          </View>
        </GestureDetector>
      );
    },
  ),
);

const SPRING_CONFIG = {
  damping: 40,
  mass: 1.03,
  stiffness: 120,
} as const;
const GESTURE_CONFIG = {
  DIRECTIONAL_OFFSET: 10, // ジェスチャーの方向判定のための閾値
  TAP_THRESHOLD: 10, // タップと判定する最大移動距離
} as const;
const DEFAULT_LEFT_THRESHOLD = -100;
const DEFAULT_RIGHT_THRESHOLD = 0;

const stylesheet = createStyleSheet(() => ({
  righActionsLayer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
}));
