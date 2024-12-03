import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadCalendar } from './functions';
import { keys } from './keys';

export const queryOptions = {
  loadCalendar: () =>
    queryOptionsRQ({
      queryKey: keys.one,
      queryFn: loadCalendar,
    }),
};
