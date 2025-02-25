import TransactionCategory, { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import { NotFoundTransactionCategoryError } from '@/src/domain/error';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

import { CreateRequest, UpdateRequest } from './types';

export async function createCategory(request: CreateRequest) {
  const repoCategory = RepositoryRegistry.getInstance().transactionCategoryRepository;

  const { name, iconName, iconColor, type } = request.category;
  const category = TransactionCategory.create(name, iconName, iconColor, type);

  await repoCategory.save(category);

  return category;
}

export async function updateCategory(request: UpdateRequest) {
  const repoCategory = RepositoryRegistry.getInstance().transactionCategoryRepository;

  const { id, name, iconName, iconColor } = request.category;
  const existed = await repoCategory.find(TransactionCategoryId.build(id));
  if (!existed) throw new NotFoundTransactionCategoryError('カテゴリが存在しません', { context: { id } });

  const category = existed?.update(name, iconName, iconColor);

  await repoCategory.save(category);

  return category;
}
