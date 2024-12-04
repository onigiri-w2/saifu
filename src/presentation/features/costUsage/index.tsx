import { useEffect, useState } from 'react';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

import { loadToday } from '../../usecase/query/today/functions';

import MonthlyCarousel from './components/MonthlyCarousel';

export default function CostUsage() {
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

  return <MonthlyCarousel initialYearmonth={yearmonth} />;
}
