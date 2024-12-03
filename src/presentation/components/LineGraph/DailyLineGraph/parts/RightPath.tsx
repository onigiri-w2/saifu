import React, { useMemo } from 'react';

import { DashPathEffect, Path } from '@shopify/react-native-skia';
import { curveMonotoneX, line } from 'd3';

import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

type Props = {
  points: TimePoint[];
  scale: Scale;
  color: string;
  offsetIndex: number;
};
const RightPath = React.memo(({ points, scale, color, offsetIndex }: Props) => {
  const path = usePath(points, scale, offsetIndex);
  return (
    <Path path={path} strokeWidth={2} style="stroke" color={color} opacity={0.3}>
      <DashPathEffect intervals={[6, 6]} phase={5} />
    </Path>
  );
});

const usePath = (points: TimePoint[], scale: Scale, offset: number) => {
  const { xScale, yScale } = scale;
  const path = useMemo(() => {
    const lineGenerator = line<TimePoint>()
      .x((_, i) => xScale.scale(i + offset))
      .y((tp) => yScale.scale(tp.value))
      .curve(curveMonotoneX);
    return lineGenerator(points) as string;
  }, [points, scale]);

  return path;
};

export default RightPath;
