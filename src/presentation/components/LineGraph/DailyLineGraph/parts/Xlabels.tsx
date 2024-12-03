import React from 'react';
import { Platform } from 'react-native';

import { matchFont, Text } from '@shopify/react-native-skia';

import { Scale } from '../models/scale';
import { TimePoint } from '../models/timepoint';

type Props = {
  points: TimePoint[];
  scale: Scale;
  height: number;
};
const Xlabels = React.memo(({ points, scale, height }: Props) => {
  const fontFamily = Platform.select({ ios: 'Hiragino Sans', default: 'serif' });
  const font = matchFont({ fontFamily, fontSize: 11, fontStyle: 'normal', fontWeight: 'normal' });

  // 最後のラベルがはみ出すので一旦非表示
  const ticks = generateIndexTicks(points.length, 5, 4).slice(0, -1);

  const xAxisLabels = ticks.map((i) => {
    const label = `${points[i].date.day}日`;
    return (
      <Text
        key={i}
        x={scale.xScale.scale(i) - font.measureText(label).width / 2}
        y={height - 8}
        text={label}
        font={font}
        color="rgba(0, 0, 0, 0.8)"
        opacity={0.6}
      />
    );
  });

  return <>{xAxisLabels}</>;
});

function generateIndexTicks(size: number, interval: number, offset: number = 0): number[] {
  if (interval < 1) throw new Error('intervalは1以上である必要があります');
  if (offset < 0) throw new Error('offsetは0以上である必要があります');

  const ticks: number[] = [];
  let current = offset;
  while (current < size) {
    ticks.push(current);
    current += interval;
  }
  return ticks;
}

export default Xlabels;
