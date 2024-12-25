import React from 'react';

import { SharedValue } from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

import Today from '@/src/domain/aggregation/today';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import DailyLineGraph from '@/src/presentation/components/LineGraph/DailyLineGraph';
import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

type Props = {
  cost: DailyTimeSeries;
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
};
function CostChart({ cost, today, focusDate }: Props) {
  const { theme } = useStyles();
  const points = cost.asStock().map((s) => ({
    date: convertToJsonLocalDate(s.date),
    value: s.value,
  }));

  return (
    <DailyLineGraph
      points={points}
      today={today.date}
      appearance={{
        color: 'red',
        dimensions: { width: DEVICE_LAYOUT.width - theme.spacing.x4 * 2, height: 180 },
      }}
      focusDate={focusDate}
    />
  );
}
export default React.memo(
  CostChart,
  (prev, next) =>
    JSON.stringify(prev.cost) === JSON.stringify(next.cost) &&
    JSON.stringify(prev.today) === JSON.stringify(next.today) &&
    prev.focusDate === next.focusDate,
);
