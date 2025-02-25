import { useCalendarMutation } from './calendar/mutation';
import { useCategoryMutation } from './category/mutation';
import { useExpenseMutation } from './expense/mutation';

export const useMutations = {
  category: useCategoryMutation,
  calendar: useCalendarMutation,
  expense: useExpenseMutation,
};
