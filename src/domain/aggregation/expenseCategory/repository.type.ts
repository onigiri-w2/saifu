import ExpenseCategory, { ExpenseCategoryId } from '.';

interface IExpenseCategoryRepository {
  save: (entity: ExpenseCategory) => Promise<void>;
  remove: (id: ExpenseCategoryId) => Promise<void>;
  find: (id: ExpenseCategoryId) => Promise<ExpenseCategory | undefined>;
  findAll: () => Promise<ExpenseCategory[]>;
}

export default IExpenseCategoryRepository;
