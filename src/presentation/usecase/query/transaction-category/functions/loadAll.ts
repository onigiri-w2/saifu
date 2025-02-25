import TransactionCategory, { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import { NotFoundTransactionCategoryError } from '@/src/domain/error';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export async function loadAllTransactionCategories(): Promise<TransactionCategory[]> {
  const repoRegistry = RepositoryRegistry.getInstance();
  const categories = await repoRegistry.transactionCategoryRepository.findAll('both');
  return categories;
}

export async function loadTransactionCategory(id: string): Promise<TransactionCategory> {
  const repoRegistry = RepositoryRegistry.getInstance();
  const category = await repoRegistry.transactionCategoryRepository.find(TransactionCategoryId.build(id));

  if (!category) throw new NotFoundTransactionCategoryError('指定のカテゴリが見つかりません', { context: { id } });
  return category;
}
