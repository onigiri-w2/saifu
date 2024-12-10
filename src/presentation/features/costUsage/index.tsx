import React from 'react';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { ActionsContext } from './context/ActionsContext';
import { RenderingModeSwitchProvider } from './context/RenderingModeSwitchContext';
import MonthlyCarousel from './MonthlyCaousel';

type Props = {
  initialYearmonth: Yearmonth;
  useDeferredRndering: boolean;
  onChangeYearmonth?: (yearmonth: Yearmonth) => void;
  onSelectExpenseItem?: (expenseId: string) => void;
};
function CostUsage({ initialYearmonth, useDeferredRndering, onChangeYearmonth, onSelectExpenseItem }: Props) {
  return (
    <ActionsContext.Provider value={{ onSelectExpenseItem }}>
      <RenderingModeSwitchProvider useDeferredRendering={useDeferredRndering} initialYearmonth={initialYearmonth}>
        <MonthlyCarousel initialYearmonth={initialYearmonth} onChangeYearmonth={onChangeYearmonth} />
      </RenderingModeSwitchProvider>
    </ActionsContext.Provider>
  );
}

export default React.memo(CostUsage);
