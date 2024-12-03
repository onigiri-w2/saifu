import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import BudgetNoneStrategy from '@/src/domain/aggregation/budgetPlan/strategy/none';
import BudgetRegularlyStrategy from '@/src/domain/aggregation/budgetPlan/strategy/regularly';
import Category from '@/src/domain/aggregation/category';
import Money from '@/src/domain/valueobject/money';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

import { AddRequest, UpdateRequest } from './types';

export const addBudgetingCategory = async (request: AddRequest) => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { name, iconName, iconColor } = request.category;
  const category = Category.create(name, iconName, iconColor);

  let budgetPlan = BudgetPlan.withNone(category.id);
  if (request.budgetPlan.strategy.type === 'regularly') {
    budgetPlan = BudgetPlan.withRegularly(
      category.id,
      request.budgetPlan.strategy.cycle,
      request.budgetPlan.strategy.amount,
    );
  }

  await Promise.all([repoCategory.save(category), repoBudgetPlan.save(budgetPlan)]);
  return { category, budgetPlan };
};

export const updateBudgetingCategory = async (request: UpdateRequest) => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { id, name, iconName, iconColor } = request.category;
  const category = Category.build(id, name, iconName, iconColor);

  let strategy: BudgetNoneStrategy | BudgetRegularlyStrategy = BudgetNoneStrategy.build();
  if (request.budgetPlan.strategy.type === 'regularly') {
    strategy = BudgetRegularlyStrategy.build(
      Money.build(request.budgetPlan.strategy.amount),
      request.budgetPlan.strategy.cycle,
    );
  }
  const budgetPlan = BudgetPlan.build(request.budgetPlan.id, request.category.id, strategy);

  await Promise.all([repoCategory.save(category), repoBudgetPlan.save(budgetPlan)]);
  return { category, budgetPlan };
};

export const deleteBudgetingCategory = async (request: { categoryId: string }) => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoExpense = RepositoryRegistry.getInstance().expenseRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;
  const target = await repoCategory.find(request.categoryId);

  if (!target) return;
  await repoCategory.remove(target.id);
  await Promise.all([repoExpense.removeByCategoryId(target.id), repoBudgetPlan.removeByCategoryId(target.id)]);

  return target;
};
