import { Gesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { findClosestNumberAndIndex } from '../../functions/worklet/findClosestNumberAndIndex';
import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

export const useGesture = (focusDate: SharedValue<JsonLocalDate>, points: TimePoint[], scale: Scale) => {
  const xScaleValues = points.map((_, i) => scale.xScale.scale(i));

  const updateFocusDate = (x: number) => {
    'worklet';
    const index = findClosestNumberAndIndex(xScaleValues, x).index;
    // 非同期を考慮して防御
    const safeIndex = Math.min(Math.max(0, index), points.length - 1);
    focusDate.value = points[safeIndex].date;
  };

  const panGesture = Gesture.Pan().onChange((e) => {
    updateFocusDate(e.x);
  });
  const touchGesture = Gesture.Tap().onEnd((e) => {
    updateFocusDate(e.x);
  });
  const gesture = Gesture.Exclusive(panGesture, touchGesture);

  return gesture;
};
