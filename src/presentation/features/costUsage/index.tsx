import React from 'react';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { RenderingModeSwitchProvider } from './context/RenderingModeSwitchContext';
import MonthlyCarousel from './MonthlyCaousel';

type Props = {
  initialYearmonth: Yearmonth;
  useDeferredRndering: boolean;
  onChangeYearmonth?: (yearmonth: Yearmonth) => void;
};
function CostUsage({ initialYearmonth, useDeferredRndering, onChangeYearmonth }: Props) {
  return (
    <RenderingModeSwitchProvider useDeferredRendering={useDeferredRndering} initialYearmonth={initialYearmonth}>
      <MonthlyCarousel initialYearmonth={initialYearmonth} onChangeYearmonth={onChangeYearmonth} />
    </RenderingModeSwitchProvider>
  );
}

export default React.memo(CostUsage);
