import { Day, Month, Year } from '../domain/valueobject/types';

export function clampDateToMonthEnd(year: Year, month: Month, day: Day) {
  // 各月の最大日数
  const daysEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // うるう年の判定
  if (isLeapYear(year)) daysEachMonth[1] = 29;

  // 日を1から月の最大日数の範囲に調整
  day = Math.max(1, Math.min(daysEachMonth[month - 1], day)) as Day;

  return { year, month, day };
}

export function getDaysInMonth(year: Year, month: Month) {
  const daysEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) daysEachMonth[1] = 29;

  return daysEachMonth[month - 1];
}

export function isLeapYear(year: Year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function isEqualDate(
  date1: { year: Year; month: Month; day: Day },
  date2: { year: Year; month: Month; day: Day },
) {
  return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
}
