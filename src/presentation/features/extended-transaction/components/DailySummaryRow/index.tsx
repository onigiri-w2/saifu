import React from 'react';
import { Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LocalDate from '@/src/domain/model/valueobject/localdate';
import { dateFormat } from '@/src/presentation/i18n/format/date';
import { numberFormat } from '@/src/presentation/i18n/format/number';

type Props = {
  date: LocalDate;
  total: number;
};
function DailySummaryRow({ date, total }: Props) {
  const dateLabel = dateFormat(date.datetime);

  const { styles } = useStyles(stylesheet);
  return (
    <Animated.View style={styles.container}>
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.totalLabel}>{numberFormat(total)}</Text>
    </Animated.View>
  );
}

export default React.memo(
  DailySummaryRow,
  (prev, next) => JSON.stringify(prev.date) === JSON.stringify(next.date) && prev.total === next.total,
);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.x3,
  },
  dateLabel: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  totalLabel: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.tertiary,
    opacity: 0,
  },
}));
