import { ChartDate, compare } from './date';

export interface TimePoint {
  date: ChartDate;
  value: number;
}

export function divide(points: TimePoint[], referenceDate: ChartDate): { left: TimePoint[]; right: TimePoint[] } {
  if (points.length === 0) return { left: [], right: [] };
  // 単純に日付で分ける
  const before = points.filter((p) => compare(p.date, referenceDate) <= 0);
  const after = points.filter((p) => compare(p.date, referenceDate) >= 0);

  return {
    left: before.length === 0 ? [after[0]] : before,
    right: after.length === 0 ? [before[before.length - 1]] : after,
  };
}
