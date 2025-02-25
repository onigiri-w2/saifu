import BudgetPlan from '@/src/domain/model/aggregation/budgetPlan';
import { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export async function loadAllBudgetPlan() {
  const repo = RepositoryRegistry.getInstance().budgetPlanRepository;
  return await repo.findAll();
}

export async function loadBudgetPlanByCategoryId(categoryId: string): Promise<BudgetPlan | undefined> {
  const repo = RepositoryRegistry.getInstance().budgetPlanRepository;
  return await repo.findByCategoryId(TransactionCategoryId.build(categoryId));
}
