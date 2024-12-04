import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadCalendar } from './functions';
import { calendarKeys } from './keys';

export const calendarQueryOptions = {
  loadCalendar: () =>
    queryOptionsRQ({
      queryKey: calendarKeys.one,
      queryFn: loadCalendar,
    }),
};
