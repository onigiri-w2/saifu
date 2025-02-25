import { TransactionCategoryId } from '../transactionCategory';

import Transaction, { TransactionId, TransactionType } from '.';

interface ITransactionRepository {
  save: (entity: Transaction) => Promise<void>;
  remove: (id: TransactionId) => Promise<void>;
  removeByCategoryId: (categoryId: TransactionCategoryId) => Promise<void>;
  find: (id: TransactionId) => Promise<Transaction | undefined>;
  findSome: (
    type: TransactionType | 'both',
    categoryIds: TransactionCategoryId[],
    from?: Date,
    to?: Date,
    dateOrder?: 'asc' | 'desc',
  ) => Promise<Transaction[]>;
}

export default ITransactionRepository;
