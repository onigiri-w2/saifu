import React from 'react';
import { View, Text } from 'react-native';

import Svg, { Rect, Line } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import ClockSvg from '@/assets/icons/lucide/clock.svg';
import { ActiveBudgetMetrics } from '@/src/domain/projection/budgetMetrics/activeBudget/metrics';
import { numberFormat } from '@/src/presentation/i18n/format';

import { BORDER_HEIGHT, BAR_HEIGHT, BORDER_WIDTH } from '../constants';
import { rowBodyStyleSheet } from '../style';

const DAY_ICON_SIZE = 12;
type Props = {
  metrics: ActiveBudgetMetrics;
};
export function EntirlyRowBody({ metrics }: Props) {
  const remainingMoney = numberFormat(metrics.period.money.budget - metrics.period.money.spending);
  const remainingDays = `${metrics.period.days.remaining}日`;

  const { styles, theme } = useStyles(rowBodyStyleSheet);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Text style={styles.mainValue}>{remainingMoney}</Text>
      <View style={styles.subValueWrap}>
        <ClockSvg width={DAY_ICON_SIZE} height={DAY_ICON_SIZE} stroke={theme.colors.text.primary} />
        <Text style={styles.subValue}>{remainingDays}</Text>
      </View>
    </View>
  );
}

export function EntirlyRowBar({ metrics }: Props) {
  const fillPercent = Math.max(
    ((metrics.period.money.budget - metrics.period.money.spending) / metrics.period.money.budget) * 100,
    0,
  );
  const linePercent = ((metrics.period.days.remaining - 1) / metrics.period.days.total) * 100;

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
        x={0}
        height={BAR_HEIGHT}
        width={`${fillPercent}%`}
        fill={fillPercent >= (linePercent ?? 0) ? theme.colors.brand.primary : theme.colors.status.warning}
      />
      <Line
        x1={`${linePercent}%`}
        y1={0}
        x2={`${linePercent}%`}
        y2={linePercent === 0 ? 0 : BORDER_HEIGHT}
        stroke={theme.colors.text.primary}
        strokeWidth={BORDER_WIDTH}
      />
    </Svg>
  );
}
