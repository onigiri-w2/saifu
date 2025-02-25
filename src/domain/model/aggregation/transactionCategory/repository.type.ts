import TransactionCategory, { TransactionCategoryId, TransactionCategoryType } from '.';

interface ITransactionCategoryRepository {
  save: (entity: TransactionCategory) => Promise<void>;
  remove: (id: TransactionCategoryId) => Promise<void>;
  find: (id: TransactionCategoryId) => Promise<TransactionCategory | undefined>;
  findAll: (type: TransactionCategoryType | 'both') => Promise<TransactionCategory[]>;
}

export default ITransactionCategoryRepository;
