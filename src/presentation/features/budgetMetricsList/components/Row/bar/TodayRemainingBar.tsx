import React from 'react';

import { Svg, Rect } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';

import { BORDER_HEIGHT, BAR_HEIGHT } from '../constants';

type Props = {
  monitor: ThisCycleMonitor;
};

function Bar({ monitor }: Props) {
  const remainngTodayMoney = monitor.remainingTodayMoney();
  const todayBudget = monitor.overview().todayBudget;
  if (remainngTodayMoney === undefined || todayBudget === undefined) return null;

  const fillPercent = (remainngTodayMoney / todayBudget) * 100;

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
        width={`${fillPercent}%`}
        height={BAR_HEIGHT}
        fill={theme.colors.brand.primary}
      />
    </Svg>
  );
}
export default React.memo(Bar);
