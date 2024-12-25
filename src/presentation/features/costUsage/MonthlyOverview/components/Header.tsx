import React from 'react';
import { View } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Today from '@/src/domain/aggregation/today';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import CostChart from './CostChart';
import Title from './Title';

type Props = {
  cost: DailyTimeSeries;
  focusDate: SharedValue<JsonLocalDate>;
  today: Today;
};
function Header({ cost, focusDate, today }: Props) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Title cost={cost} focusDate={focusDate} />
      <CostChart cost={cost} today={today} focusDate={focusDate} />
    </View>
  );
}
export default React.memo(Header);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginBottom: theme.spacing.x3,
    paddingHorizontal: theme.spacing.x4,
    gap: theme.spacing.x6,
  },
}));
