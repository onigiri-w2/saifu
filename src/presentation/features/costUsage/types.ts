import ExpenseCategory from '@/src/domain/aggregation/expenseCategory';
import Expense from '@/src/domain/aggregation/expense';
import LocalDate from '@/src/domain/valueobject/localdate';

export type ExpenseViewData = {
  category: ExpenseCategory;
  expense: Expense;
};
export const isExpenseViewData = (v: any): v is ExpenseViewData => {
  return v && v.category && v.expense;
};

export type TimelineViewData = (Expense | LocalDate)[];
