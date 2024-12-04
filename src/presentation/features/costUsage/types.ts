import Category from '@/src/domain/aggregation/category';
import Expense from '@/src/domain/aggregation/expense';

import { CostStock } from '../../usecase/query/cost-stocks/functions';

export type ExpenseViewData = {
  category: Category;
  expense: Expense;
};
export const isExpenseViewData = (v: any): v is ExpenseViewData => {
  return v && v.category && v.expense;
};

export type StockViewData = {
  category: Category;
  stock: CostStock['stock'];
};
