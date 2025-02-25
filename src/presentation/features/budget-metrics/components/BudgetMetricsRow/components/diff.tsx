import React from 'react';
import { View, Text } from 'react-native';

import Svg, { Rect, Line } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';
import { numberFormat } from '@/src/presentation/i18n/format/number';

import { BORDER_HEIGHT, BAR_HEIGHT, BORDER_WIDTH } from '../constants';
import { rowBodyStyleSheet } from '../style';

type Props = {
  metrics: ActiveBudgetMetrics;
};
export function DiffRowBody({ metrics }: Props) {
  const remainingMoney = numberFormat(metrics.data.period.money.paceDeviation);

  const { styles } = useStyles(rowBodyStyleSheet);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Text style={styles.mainValue}>{remainingMoney}</Text>
      <Text style={styles.subValue}>差分</Text>
    </View>
  );
}

export function DiffRowBar({ metrics }: Props) {
  const fillPercent = Math.max(
    ((metrics.data.period.money.budget - metrics.data.period.money.spending) / metrics.data.period.money.budget) * 100,
    0,
  );
  const linePercent = ((metrics.data.period.days.remaining - 1) / metrics.data.period.days.total) * 100;
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
        fill={fillPercent < linePercent ? theme.colors.status.error : theme.colors.brand.primary}
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
