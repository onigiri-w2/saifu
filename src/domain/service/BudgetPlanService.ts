import BudgetPlan from '../aggregation/budgetPlan';
import Category from '../aggregation/category';

export default class BudgetPlanService {
  static ensureValidBudgetPlans(budgetPlans: BudgetPlan[], categories: Category[]): BudgetPlan[] {
    const validBudgetPlans = categories.map((c) => {
      const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
      return bp ? bp : BudgetPlan.withNone(c.id);
    });

    return validBudgetPlans
      .map((bp) => {
        const category = categories.find((c) => c.id === bp.categoryId);
        if (!category) return undefined;
        return bp;
      })
      .filter((bp): bp is BudgetPlan => bp !== undefined);
  }
}
