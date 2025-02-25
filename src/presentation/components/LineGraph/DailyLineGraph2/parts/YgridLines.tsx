import React, { useMemo } from 'react';
import { Platform } from 'react-native';

import { Line, matchFont, Text } from '@shopify/react-native-skia';

import { numberFormat } from '@/src/presentation/i18n/format';

import { Scale } from '../models/scale';

type Props = {
  scale: Scale;
  width: number;
};
const YgridLines = React.memo(({ scale, width }: Props) => {
  const { yScale } = scale;
  const font = useFont();

  const [minY, maxY] = yScale.scale.domain();
  const halfY = (minY + maxY) / 2;
  const linePositions = [minY, halfY, maxY];

  const textForMaxY = numberFormat(maxY, false);

  return (
    <>
      <Line
        p1={{ x: 0, y: yScale.scale(linePositions[2]) }}
        p2={{ x: width, y: yScale.scale(linePositions[2]) }}
        color="rgba(200, 200, 200, 0.5)"
        style="stroke"
        strokeWidth={1}
      />
      <Line
        p1={{ x: 0, y: yScale.scale(linePositions[1]) }}
        p2={{ x: width, y: yScale.scale(linePositions[1]) }}
        color="rgba(200, 200, 200, 0.5)"
        style="stroke"
        strokeWidth={1}
      />
      <Line
        p1={{ x: 0, y: yScale.scale(linePositions[0]) }}
        p2={{ x: width, y: yScale.scale(linePositions[0]) }}
        color="rgba(200, 200, 200, 0.5)"
        style="stroke"
        strokeWidth={1}
      />
      <Text
        x={width - font.measureText(textForMaxY).width}
        y={font.measureText(textForMaxY).height}
        text={textForMaxY}
        font={font}
        color="rgba(0, 0, 0, 0.8)"
        opacity={0.6}
      />
    </>
  );
});

const useFont = () => {
  return useMemo(() => {
    const fontFamily = Platform.select({ ios: 'Hiragino Sans', default: 'serif' });
    return matchFont({ fontFamily, fontSize: 11, fontStyle: 'normal', fontWeight: 'normal' });
  }, []);
};

export default YgridLines;
