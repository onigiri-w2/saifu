import BudgetPlan, { BudgetPlanId } from '@/src/domain/model/aggregation/budgetPlan';
import BudgetNoneStrategy from '@/src/domain/aggregation/budgetPlan/strategy/none';
import BudgetRegularlyStrategy from '@/src/domain/model/aggregation/budgetPlan/strategy/regularly';
import TransactionCategory, { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Money from '@/src/domain/model/valueobject/money';

import { AddRequest, UpdateRequest } from './types';

export const createBudgetingCategory = async (request: AddRequest) => {
  const repoCategory = RepositoryRegistry.getInstance().transactionCategoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { name, iconName, iconColor } = request.category;
  const category = TransactionCategory.create(name, iconName, iconColor, 'expenseCategory');

  let budgetPlan = BudgetPlan.withNone(category.id);
  if (request.budgetPlan.strategy.type === 'regularly') {
    budgetPlan = BudgetPlan.withRegularly(
      category.id,
      request.budgetPlan.strategy.cycle,
      request.budgetPlan.strategy.amount,
      request.budgetPlan.strategy.tempAmount,
    );
  }

  await Promise.all([repoCategory.save(category), repoBudgetPlan.save(budgetPlan)]);
  return { category, budgetPlan };
};

export const updateBudgetingCategory = async (request: UpdateRequest) => {
  const repoCategory = RepositoryRegistry.getInstance().transactionCategoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { id, name, iconName, iconColor } = request.category;
  const category = TransactionCategory.build(
    TransactionCategoryId.build(id),
    name,
    iconName,
    iconColor,
    'expenseCategory',
  );

  let strategy: BudgetNoneStrategy | BudgetRegularlyStrategy = BudgetNoneStrategy.build();
  if (request.budgetPlan.strategy.type === 'regularly') {
    const tempAmount = request.budgetPlan.strategy.tempAmount;
    strategy = BudgetRegularlyStrategy.build(
      Money.build(request.budgetPlan.strategy.amount),
      request.budgetPlan.strategy.cycle,
      tempAmount !== undefined ? Money.build(tempAmount) : undefined,
    );
  }
  const budgetPlan = BudgetPlan.build(
    BudgetPlanId.build(request.budgetPlan.id),
    TransactionCategoryId.build(id),
    strategy,
  );

  await Promise.all([repoCategory.save(category), repoBudgetPlan.save(budgetPlan)]);
  return { category, budgetPlan };
};

export const deleteBudgetingCategory = async (request: { categoryId: string }) => {
  const repoCategory = RepositoryRegistry.getInstance().transactionCategoryRepository;
  const repoExpense = RepositoryRegistry.getInstance().transactionRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;
  const target = await repoCategory.find(TransactionCategoryId.build(request.categoryId));

  if (!target) return;
  await repoCategory.remove(target.id);
  await Promise.all([repoExpense.removeByCategoryId(target.id), repoBudgetPlan.removeByCategoryId(target.id)]);

  return target;
};
