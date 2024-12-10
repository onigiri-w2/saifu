import { useBudgetingCategoryMutation } from './budgeting-category/mutation';
import { useCalendarMutation } from './calendar/mutation';
import { useExpenseMutation } from './expense/mutation';

export const useMutations = {
  category: useBudgetingCategoryMutation,
  calendar: useCalendarMutation,
  expense: useExpenseMutation,
};
