import { JsonObject } from 'type-fest';

import { Day, Month, Year } from '@/src/domain/valueobject/types';

export type JsonLocalDate = {
  year: Year;
  month: Month;
  day: Day;
} & JsonObject;
export const convertToJsonLocalDate = (obj: { year: Year; month: Month; day: Day }) => {
  return { year: obj.year, month: obj.month, day: obj.day };
};
