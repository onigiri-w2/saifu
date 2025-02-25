export const dayOfWeeks = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = (typeof dayOfWeeks)[number];
export const dayOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'] as const;

export type Year = number;

export const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type Month = (typeof months)[number];

export const days = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
] as const;
export type Day = (typeof days)[number];
