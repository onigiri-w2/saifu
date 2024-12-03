type LocalDate = { year: number; month: number; day: number };
export function compareOnWorklet(a: LocalDate, b: LocalDate): number {
  'worklet';
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}
