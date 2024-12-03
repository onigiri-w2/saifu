export interface ChartDate {
  year: number;
  month: number;
  day: number;
}

export function toInt(chartdate: ChartDate) {
  'worklet';
  return chartdate.year * 10000 + chartdate.month * 100 + chartdate.day;
}

export function compare(a: ChartDate, b: ChartDate) {
  'worklet';
  return toInt(a) - toInt(b);
}

export function toStr(chartdate: ChartDate) {
  return `${chartdate.year}-${chartdate.month}-${chartdate.day}`;
}
export function fromStr(str: string): ChartDate {
  const [year, month, day] = str.split('-').map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error('Invalid date string');
  }
  return { year, month, day };
}
