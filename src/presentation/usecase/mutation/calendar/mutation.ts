import { QueryClient, useMutation } from '@tanstack/react-query';

import { updateCalendar } from './functions';

export const useCalendarMutation = {
  update: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: updateCalendar,
      onSuccess: () => {},
    });
  },
};
