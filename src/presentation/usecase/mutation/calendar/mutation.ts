import { QueryClient, useMutation } from '@tanstack/react-query';

import { keys } from '../../query';

import { updateCalendar } from './functions';

export const useCalendarMutation = {
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateCalendar,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.calendar.one });
        queryClient.invalidateQueries({ queryKey: keys.projectedCostStock.root });
        queryClient.invalidateQueries({ queryKey: keys.budgetMonitor.root });
      },
    });
  },
};
