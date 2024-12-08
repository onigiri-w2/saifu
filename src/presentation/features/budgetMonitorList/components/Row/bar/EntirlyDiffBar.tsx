import React from 'react';

import { Svg, Rect, Line } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';

import { BORDER_HEIGHT, BAR_HEIGHT, BORDER_WIDTH } from '../constants';

type Props = {
  monitor: ThisCycleMonitor;
};

function Bar({ monitor }: Props) {
  const fillPercent = (monitor.remainingEntirlyMoney() / monitor.overview().budget) * 100;
  const linePercent = ((monitor.remainingEntirlyDays() - 1) / monitor.overview().totalDays) * 100;
  const borderPosition = `${linePercent}%`;

  const { theme } = useStyles();

  return (
    <Svg width="100%" height={BORDER_HEIGHT}>
      <Rect
        y={(BORDER_HEIGHT - BAR_HEIGHT) / 2}
        width="100%"
        height={BAR_HEIGHT}
        fill={theme.colors.background.layer1}
      />
      <Rect
        y={(BORDER_HEIGHT - BAR_HEIGHT) / 2}
        x={`${Math.min(fillPercent, linePercent)}%`}
        height={BAR_HEIGHT}
        width={`${Math.abs(fillPercent - linePercent)}%`}
        fill={fillPercent < linePercent ? theme.colors.status.warning : theme.colors.brand.primary}
      />
      <Line
        x1={borderPosition}
        y1={0}
        x2={borderPosition}
        y2={linePercent === 0 ? 0 : BORDER_HEIGHT}
        stroke={theme.colors.text.primary}
        strokeWidth={BORDER_WIDTH}
      />
    </Svg>
  );
}
export default React.memo(Bar);
