import React from 'react';
import { View } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { DailyStock } from '@/src/domain/valueobject/timeseries';
import Today from '@/src/domain/aggregation/today';
import { LocalDate } from '@/src/utils/dates';

import CostChart from '../CostChart';
import MonthlyCostHeader from '../MonthlyCostHeader';

type Props = {
  stock: DailyStock;
  focusDate: SharedValue<LocalDate>;
  today: Today;
};
function Header({ stock, focusDate, today }: Props) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <MonthlyCostHeader stock={stock} focusDate={focusDate} />
      <CostChart stock={stock} today={today} focusDate={focusDate} />
    </View>
  );
}
export default React.memo(Header);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginBottom: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.xl,
  },
}));
