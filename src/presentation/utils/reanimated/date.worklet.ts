import { Month } from '@/src/domain/model/valueobject/types';

import { JsonLocalDate, JsonYearmonth } from './types';

export function compareOnWorklet(a: JsonLocalDate, b: JsonLocalDate): number {
  'worklet';
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function addMonthOnWorklet(yearmonth: JsonYearmonth, months: number): JsonYearmonth {
  'worklet';
  const totalMonths = yearmonth.year * 12 + (yearmonth.month - 1) + months;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = ((totalMonths % 12) + 1) as Month;

  return { year: newYear, month: newMonth };
}
