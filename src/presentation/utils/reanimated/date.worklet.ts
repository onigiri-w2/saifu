import { JsonLocalDate } from './types';

export function compareOnWorklet(a: JsonLocalDate, b: JsonLocalDate): number {
  'worklet';
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}
