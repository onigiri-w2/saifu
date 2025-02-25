import React from 'react';
import { View, Text } from 'react-native';

import Svg, { Rect } from 'react-native-svg';
import { useStyles } from 'react-native-unistyles';

import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';
import { numberFormat } from '@/src/presentation/i18n/format/number';

import { BORDER_HEIGHT, BAR_HEIGHT } from '../constants';
import { rowBodyStyleSheet } from '../style';

type Props = {
  metrics: ActiveBudgetMetrics;
};
export function TodayRowBody({ metrics }: Props) {
  const remainingMoney = numberFormat(metrics.data.today.money.budget - metrics.data.today.money.spending);

  const { styles } = useStyles(rowBodyStyleSheet);

  return (
    <View style={styles.valueTextWrap}>
      <View style={styles.mainValueWrap}>
        <Text style={styles.mainValuePrefix}>残り</Text>
        <Text style={styles.mainValue}>{remainingMoney}</Text>
      </View>
      <View style={styles.subValueWrap}>
        <Text style={styles.subValue}>今日</Text>
      </View>
    </View>
  );
}

export function TodayRowBar({ metrics }: Props) {
  const fillPercent =
    ((metrics.data.today.money.budget - metrics.data.today.money.spending) / metrics.data.today.money.budget) * 100;

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
        fill={theme.colors.brand.primary}
      />
    </Svg>
  );
}
