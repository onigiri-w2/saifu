import { IncomeCategoryId } from '../incomeCategory';

import Income, { IncomeId } from '.';

interface IIncomeRepository {
  save: (entity: Income) => Promise<void>;
  remove: (id: IncomeId) => Promise<void>;
  removeByCategoryId: (categoryId: IncomeCategoryId) => Promise<void>;
  find: (id: IncomeId) => Promise<Income | undefined>;
  findSome: (categoryIds: IncomeCategoryId[], from?: Date, to?: Date, dateOrder?: 'asc' | 'desc') => Promise<Income[]>;
}

export default IIncomeRepository;
