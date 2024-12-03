import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GestureRef } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import Animated, {
  SharedValue,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

type Props = {
  gesture: Exclude<GestureRef, number>;
  children: React.ReactNode;
  enabled: SharedValue<boolean>;
  onPress?: () => void;
};

function TapHighlight({ gesture, children, onPress, enabled }: Props) {
  const { theme } = useStyles();
  const pressed = useSharedValue(0);
  const tapGesture = Gesture.Tap()
    .requireExternalGestureToFail(gesture)
    .onEnd(() => {
      if (enabled.value) {
        pressed.value = withSequence(withTiming(1, { duration: 50 }), withTiming(0, { duration: 150 }));
        onPress && runOnJS(onPress)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      pressed.value,
      [0, 1],
      ['rgba(0, 0, 0, 0)', theme.colors.highlight.default],
    );
    return {
      backgroundColor,
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
export default TapHighlight;
