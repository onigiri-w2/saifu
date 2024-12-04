import { useEffect, useState } from 'react';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadToday } from '../../usecase/query/today/functions';

import { RenderingModeSwitchProvider } from './context/RenderingModeSwitchContext';
import MonthlyCarousel from './MonthlyCaousel';

type Props = {
  useDeferredRndering: boolean;
};
export default function CostUsage({ useDeferredRndering }: Props) {
  const [yearmonth, setYearmonth] = useState<Yearmonth>();

  useEffect(() => {
    loadToday().then((today) => {
      const date = today.date;
      setYearmonth(Yearmonth.build(date.year, date.month));
    });
  }, []);

  if (!yearmonth) {
    return null;
  }

  return (
    <RenderingModeSwitchProvider useDeferredRendering={useDeferredRndering} initialYearmonth={yearmonth}>
      <MonthlyCarousel initialYearmonth={yearmonth} />
    </RenderingModeSwitchProvider>
  );
}
