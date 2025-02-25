import React from 'react';
import { View, Text } from 'react-native';

import Svg, { Rect, Line } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import ClockSvg from '@/assets/icons/lucide/clock.svg';
import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';
import { numberFormat } from '@/src/presentation/i18n/format/number';

import { BORDER_HEIGHT, BAR_HEIGHT, BORDER_WIDTH } from '../constants';
import { rowBodyStyleSheet } from '../style';

const DAY_ICON_SIZE = 12;
type Props = {
  metrics: ActiveBudgetMetrics;
};
export function EntirlyRowBody({ metrics }: Props) {
  const remainingMoney = numberFormat(metrics.data.period.money.budget - metrics.data.period.money.spending);
  const remainingDays = `${metrics.data.period.days.remaining}日`;

  const { styles, theme } = useStyles(rowBodyStyleSheet);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <View style={styles.mainValueWrap}>
        <Text style={styles.mainValuePrefix}>残り</Text>
        <Text style={styles.mainValue}>{remainingMoney}</Text>
      </View>
      <View style={styles.subValueWrap}>
        <ClockSvg width={DAY_ICON_SIZE} height={DAY_ICON_SIZE} stroke={theme.colors.text.primary} />
        <Text style={styles.subValue}>{remainingDays}</Text>
      </View>
    </View>
  );
}

export function EntirlyRowBar({ metrics }: Props) {
  const fillPercent = Math.max(
    ((metrics.data.period.money.budget - metrics.data.period.money.spending) / metrics.data.period.money.budget) * 100,
    0,
  );
  const linePercent = ((metrics.data.period.days.remaining - 1) / metrics.data.period.days.total) * 100;

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
