import React from 'react';

import { Canvas, useCanvasRef } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import { DEFAULT_PADDING } from '../const';
import { Padding, EnsuredPadding } from '../types';

import { useGesture } from './hooks/useGesture';
import { ChartDate } from './models/date';
import { WrappedXScale as XScale, WrappedYScale as YScale } from './models/scale';
import { TimePoint, divide } from './models/timepoint';
import Area from './parts/Area';
import CurrentPoint from './parts/CurrentPoint';
import LeftPath from './parts/LeftPath';
import RightPath from './parts/RightPath';

type Props = {
  points: TimePoint[];
  today: ChartDate;
  focusDate: SharedValue<JsonLocalDate>;
  appearance: {
    color?: string;
    dimensions: {
      width: number;
      height: number;
    };
    padding?: Padding;
  };
};
const DailyLineGraph = React.memo(({ points, today, appearance, focusDate }: Props) => {
  const canvasRef = useCanvasRef();

  const color = appearance.color ?? 'black';
  const padding = ensurePadding(appearance.padding ?? DEFAULT_PADDING);

  const { left, right } = divide(points, today);

  const xScale = new XScale(points, appearance.dimensions.width);
  const yScale = new YScale(points, appearance.dimensions.height, padding);
  const scale = { xScale, yScale };

  const gesture = useGesture(focusDate, points, scale);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width: appearance.dimensions.width, height: appearance.dimensions.height }} ref={canvasRef}>
        <Area
          points={points}
          scale={scale}
          color={color}
          graphHeight={appearance.dimensions.height - padding.bottom}
          focusDate={focusDate}
        />
        <LeftPath points={left} scale={scale} color={color} />
        <RightPath points={right} scale={scale} color={color} offsetIndex={left.length - 1} />
        <CurrentPoint focusDate={focusDate} points={points} scale={scale} color={color} />
      </Canvas>
    </GestureDetector>
  );
});

function ensurePadding(padding: Padding): EnsuredPadding {
  return {
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 0,
  };
}

export default DailyLineGraph;
