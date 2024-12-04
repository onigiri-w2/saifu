import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadToday } from './functions';
import { todayKeys } from './keys';

export const todayQueryOptions = {
  today: () =>
    queryOptionsRQ({
      queryKey: todayKeys.today,
      queryFn: loadToday,
    }),
};
