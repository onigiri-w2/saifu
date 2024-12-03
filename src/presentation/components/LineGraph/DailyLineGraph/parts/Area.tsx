import React, { useMemo } from 'react';

import { Path } from '@shopify/react-native-skia';
import { area, curveMonotoneX } from 'd3';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

import { ChartDate, compare } from '../models/date';
import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

type Props = {
  points: TimePoint[];
  scale: Scale;
  focusDate: SharedValue<ChartDate>;
  color: string;
  graphHeight: number;
};

const Area = React.memo(({ color, points, scale, graphHeight, focusDate }: Props) => {
  const path = usePath(points, scale, graphHeight, focusDate);
  return <Path path={path} color={color} style="fill" opacity={0.1} />;
});

export const usePath = (points: TimePoint[], scale: Scale, y0: number, focusDate: SharedValue<ChartDate>) => {
  const generator = useMemo(() => {
    const { xScale, yScale } = scale;
    return area<TimePoint>()
      .x((_, i) => xScale.scale(i))
      .y0(y0)
      .y1((tp) => yScale.scale(tp.value))
      .curve(curveMonotoneX);
  }, [y0, scale]);

  const paths = points.map((_, i) => generator(points.slice(0, i + 1)));

  const path = useDerivedValue(() => {
    const index = points.findIndex((tp) => compare(tp.date, focusDate.value) === 0);
    const safeIndex = index !== -1 ? index : compare(points[0].date, focusDate.value) > 0 ? 0 : points.length - 1;
    const result = paths[safeIndex];
    return result ?? '';
  });

  return path;
};

export default Area;
