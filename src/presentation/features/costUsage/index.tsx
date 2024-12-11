import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';

import { ActionsContext } from './context/ActionsContext';
import { RenderingModeSwitchProvider } from './context/RenderingModeSwitchContext';
import { TodayContext } from './context/TodayContext';
import MonthlyCarousel from './MonthlyCaousel';

type Props = {
  initialYearmonth: Yearmonth;
  useDeferredRndering: boolean;
  onChangeYearmonth?: (yearmonth: Yearmonth) => void;
  onSelectExpenseItem?: (expenseId: string) => void;
};
function CostUsage({ initialYearmonth, useDeferredRndering, onChangeYearmonth, onSelectExpenseItem }: Props) {
  const todayQuery = useSuspenseQuery(queryOptions.today.today());

  return (
    <TodayContext.Provider value={todayQuery.data}>
      <ActionsContext.Provider value={{ onSelectExpenseItem }}>
        <RenderingModeSwitchProvider useDeferredRendering={useDeferredRndering} initialYearmonth={initialYearmonth}>
          <MonthlyCarousel initialYearmonth={initialYearmonth} onChangeYearmonth={onChangeYearmonth} />
        </RenderingModeSwitchProvider>
      </ActionsContext.Provider>
    </TodayContext.Provider>
  );
}

export default React.memo(withSuspense(CostUsage));
