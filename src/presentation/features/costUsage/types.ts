import Category from '@/src/domain/aggregation/category';
import Expense from '@/src/domain/aggregation/expense';

import { CostStock } from '../../usecase/query/cost-stocks/functions';

export type ExpenseWithCategory = {
  category: Category;
  expense: Expense;
};
export const isExpenseWithCategory = (v: any): v is ExpenseWithCategory => {
  return v && v.category && v.expense;
};

export type StockWithCategory = {
  category: Category;
  stock: CostStock['stock'];
};
