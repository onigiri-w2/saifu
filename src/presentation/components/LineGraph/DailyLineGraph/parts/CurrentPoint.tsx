import React, { useMemo } from 'react';

import { Circle } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

import { ChartDate, compare } from '../models/date';
import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

type Props = {
  focusDate: SharedValue<ChartDate>;
  points: TimePoint[];
  scale: Scale;
  color: string;
};
const CurrentPoint = React.memo(({ focusDate, points, scale, color }: Props) => {
  const { xScale, yScale } = scale;
  const xyPositions = useMemo(() => {
    const xs = points.map((_, i) => xScale.scale(i));
    const ys = points.map((tp) => yScale.scale(tp.value));
    return xs.map((x, i) => ({ x, y: ys[i] }));
  }, [points, scale]);

  const x = useDerivedValue(() => {
    const index = points.findIndex((tp) => compare(tp.date, focusDate.value) === 0);
    const safeIndex = index !== -1 ? index : compare(points[0].date, focusDate.value) > 0 ? 0 : points.length - 1;
    return xyPositions[safeIndex].x;
  });
  const y = useDerivedValue(() => {
    const index = points.findIndex((tp) => compare(tp.date, focusDate.value) === 0);
    const safeIndex = index !== -1 ? index : compare(points[0].date, focusDate.value) > 0 ? 0 : points.length - 1;
    return xyPositions[safeIndex].y;
  });

  return <Circle cx={x} cy={y} r={4} color={color} />;
});
export default CurrentPoint;
