import BudgetPlan, { BudgetPlanId } from '@/src/domain/aggregation/budgetPlan';
import BudgetNoneStrategy from '@/src/domain/aggregation/budgetPlan/strategy/none';
import BudgetRegularlyStrategy from '@/src/domain/aggregation/budgetPlan/strategy/regularly';
import ExpenseCategory, { ExpenseCategoryId } from '@/src/domain/aggregation/expenseCategory';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Money from '@/src/domain/valueobject/money';

import { AddRequest, UpdateRequest } from './types';

export const createBudgetingCategory = async (request: AddRequest) => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { name, iconName, iconColor } = request.category;
  const category = ExpenseCategory.create(name, iconName, iconColor);

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
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const { id, name, iconName, iconColor } = request.category;
  const category = ExpenseCategory.build(ExpenseCategoryId.build(id), name, iconName, iconColor);

  let strategy: BudgetNoneStrategy | BudgetRegularlyStrategy = BudgetNoneStrategy.build();
  if (request.budgetPlan.strategy.type === 'regularly') {
    const tempAmount = request.budgetPlan.strategy.tempAmount;
    strategy = BudgetRegularlyStrategy.build(
      Money.build(request.budgetPlan.strategy.amount),
      request.budgetPlan.strategy.cycle,
      tempAmount !== undefined ? Money.build(tempAmount) : undefined,
    );
  }
  const budgetPlan = BudgetPlan.build(BudgetPlanId.build(request.budgetPlan.id), ExpenseCategoryId.build(id), strategy);

  await Promise.all([repoCategory.save(category), repoBudgetPlan.save(budgetPlan)]);
  return { category, budgetPlan };
};

export const deleteBudgetingCategory = async (request: { categoryId: string }) => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoExpense = RepositoryRegistry.getInstance().expenseRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;
  const target = await repoCategory.find(ExpenseCategoryId.build(request.categoryId));

  if (!target) return;
  await repoCategory.remove(target.id);
  await Promise.all([repoExpense.removeByCategoryId(target.id), repoBudgetPlan.removeByCategoryId(target.id)]);

  return target;
};
