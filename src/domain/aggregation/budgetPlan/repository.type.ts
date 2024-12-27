import { ExpenseCategoryId } from '../expenseCategory';

import BudgetPlan, { BudgetPlanId } from '.';

interface IBudgetPlanRepository {
  save: (entity: BudgetPlan) => Promise<void>;
  remove: (id: BudgetPlanId) => Promise<void>;
  removeByCategoryId: (categoryId: ExpenseCategoryId) => Promise<void>;
  find: (id: BudgetPlanId) => Promise<BudgetPlan | undefined>;
  findByCategoryId: (categoryId: ExpenseCategoryId) => Promise<BudgetPlan | undefined>;
  findAll: () => Promise<BudgetPlan[]>;
}

export default IBudgetPlanRepository;
