import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadThisCycleMonitors } from './functions';
import { keys } from './keys';

export const queryOptions = {
  thisCycleMonitorList: () =>
    queryOptionsRQ({
      queryKey: keys['this-cycle/list'],
      queryFn: loadThisCycleMonitors,
    }),
};
