import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import Category from '@/src/domain/aggregation/category';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import { BaseError } from '@/src/utils/errors';

// 中身はdomain modelのまま渡してるので注意。
export type BudgetingCategory = {
  category: Category;
  budgetPlan: BudgetPlan;
};

export const loadBudgetingCategories = async (): Promise<BudgetingCategory[]> => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const [categories, budgetPlans] = await Promise.all([repoCategory.findAll(), repoBudgetPlan.findAll()]);

  return categories.map((category) => {
    const budgetPlan = budgetPlans.find((plan) => plan.categoryId === category.id);
    return { category, budgetPlan: budgetPlan || BudgetPlan.withNone(category.id) };
  });
};

export const loadBudgetingCategory = async (id: string): Promise<BudgetingCategory> => {
  const repoCategory = RepositoryRegistry.getInstance().categoryRepository;
  const repoBudgetPlan = RepositoryRegistry.getInstance().budgetPlanRepository;

  const category = await repoCategory.find(id);
  if (!category) {
    throw new BaseError('カテゴリが見つかりません', { context: { category } });
  }
  const budgetPlan = await repoBudgetPlan.findByCategoryId(id);

  return { category, budgetPlan: budgetPlan || BudgetPlan.withNone(id) };
};
