import { useBudgetingCategoryMutation } from './budgeting-category/mutation';
import { useCalendarMutation } from './calendar/mutation';

export const useMutations = {
  category: useBudgetingCategoryMutation,
  calendar: useCalendarMutation,
};
