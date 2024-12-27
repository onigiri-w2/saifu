import { ExpenseCategoryId } from '../expenseCategory';

import Expense, { ExpenseId } from '.';

interface IExpenseRepository {
  save: (entity: Expense) => Promise<void>;
  remove: (id: ExpenseId) => Promise<void>;
  removeByCategoryId: (categoryId: ExpenseCategoryId) => Promise<void>;
  find: (id: ExpenseId) => Promise<Expense | undefined>;
  findSome: (
    categoryIds: ExpenseCategoryId[],
    from?: Date,
    to?: Date,
    dateOrder?: 'asc' | 'desc',
  ) => Promise<Expense[]>;
}

export default IExpenseRepository;
