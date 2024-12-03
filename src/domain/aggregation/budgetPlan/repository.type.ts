import BudgetPlan from '.';

interface IBudgetPlanRepository {
  save: (entity: BudgetPlan) => Promise<void>;
  remove: (id: string) => Promise<void>;
  removeByCategoryId: (categoryId: string) => Promise<void>;
  find: (id: string) => Promise<BudgetPlan | undefined>;
  findByCategoryId: (categoryId: string) => Promise<BudgetPlan | undefined>;
  findAll: () => Promise<BudgetPlan[]>;
}

export default IBudgetPlanRepository;
