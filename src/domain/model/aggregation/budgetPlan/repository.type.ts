import { TransactionCategoryId } from '../transactionCategory';

import BudgetPlan, { BudgetPlanId } from '.';

interface IBudgetPlanRepository {
  save: (entity: BudgetPlan) => Promise<void>;
  remove: (id: BudgetPlanId) => Promise<void>;
  find: (id: BudgetPlanId) => Promise<BudgetPlan | undefined>;
  findByCategoryId: (categoryId: TransactionCategoryId) => Promise<BudgetPlan | undefined>;
  findAll: () => Promise<BudgetPlan[]>;
}

export default IBudgetPlanRepository;
