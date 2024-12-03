import React, { useMemo } from 'react';

import { Path } from '@shopify/react-native-skia';
import { curveMonotoneX, line } from 'd3';

import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

type Props = {
  points: TimePoint[];
  scale: Scale;
  color: string;
};
const LeftPath = React.memo(({ points, scale, color }: Props) => {
  const path = usePath(points, scale);
  return <Path path={path} strokeWidth={2} style="stroke" color={color} />;
});

const usePath = (points: TimePoint[], scale: Scale) => {
  const { xScale, yScale } = scale;
  const path = useMemo(() => {
    const lineGenerator = line<TimePoint>()
      // NOTE: xScale.scale(tp.date)にできる方が読みやすい。内部で調整した方がいい
      .x((_, i) => xScale.scale(i))
      .y((tp) => yScale.scale(tp.value))
      .curve(curveMonotoneX);
    return lineGenerator(points) as string;
  }, [points, scale]);

  return path;
};
export default LeftPath;
