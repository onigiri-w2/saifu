import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadToday } from './functions';
import { keys } from './keys';

export const queryOptions = {
  today: () =>
    queryOptionsRQ({
      queryKey: keys.today,
      queryFn: loadToday,
    }),
};
