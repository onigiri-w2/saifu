import React from 'react';

import { SharedValue } from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

import Today from '@/src/domain/aggregation/today';
import DailyLineGraph from '@/src/presentation/components/LineGraph/DailyLineGraph';
import { CostStock } from '@/src/presentation/usecase/query/projected-coststock/functions';
import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';
import { JsonLocalDate, convertToJsonLocalDate } from '@/src/presentation/utils/reanimated/types';

type Props = {
  stock: CostStock;
  today: Today;
  focusDate: SharedValue<JsonLocalDate>;
};
function CostChart({ stock, today, focusDate }: Props) {
  const { theme } = useStyles();
  const points = stock.points.map((p) => ({
    date: convertToJsonLocalDate(p.date),
    value: p.value,
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
    JSON.stringify(prev.stock) === JSON.stringify(next.stock) &&
    JSON.stringify(prev.today) === JSON.stringify(next.today) &&
    prev.focusDate === next.focusDate,
);
