import IncomeCategory, { IncomeCategoryId } from '.';

interface IIncomeCategoryRepository {
  save: (entity: IncomeCategory) => Promise<void>;
  remove: (id: IncomeCategoryId) => Promise<void>;
  find: (id: IncomeCategoryId) => Promise<IncomeCategory | undefined>;
  findAll: () => Promise<IncomeCategory[]>;
}

export default IIncomeCategoryRepository;
