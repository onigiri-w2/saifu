import { queryOptions as queryOptionsRQ } from '@tanstack/react-query';

import { loadThisCycleMonitors } from './functions';
import { budgetMonitorKeys } from './keys';

export const budgetMonitorQueryOptions = {
  thisCycleMonitorList: () =>
    queryOptionsRQ({
      queryKey: budgetMonitorKeys['this-cycle/list'],
      queryFn: loadThisCycleMonitors,
    }),
};
