import Expense from '.';

interface IExpenseRepository {
  save: (entity: Expense) => Promise<void>;
  remove: (id: string) => Promise<void>;
  removeByCategoryId: (categoryId: string) => Promise<void>;
  find: (id: string) => Promise<Expense | undefined>;
  findSome: (categoryId?: string, from?: Date, to?: Date, dateOrder?: 'asc' | 'desc') => Promise<Expense[]>;
}

export default IExpenseRepository;
