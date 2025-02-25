import Transaction from '@/src/domain/model/aggregation/transaction';
import TransactionCategory from '@/src/domain/model/aggregation/transactionCategory';

export type ExtendedTransaction = {
  transaction: Transaction;
  category: TransactionCategory;
};

export function isExtendedTransaction(item: unknown): item is ExtendedTransaction {
  if (typeof item !== 'object' || item === null) return false;
  if (!('transaction' in item)) return false;
  if (!('category' in item)) return false;
  if (!(item.transaction instanceof Transaction)) return false;
  if (!(item.category instanceof TransactionCategory)) return false;
  return true;
}
