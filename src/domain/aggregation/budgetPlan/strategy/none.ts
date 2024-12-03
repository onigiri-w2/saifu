import { IBudgetNoneStrategy } from '../types';

class BudgetNoneStrategy implements IBudgetNoneStrategy {
  public readonly type = 'none';

  private constructor() {}

  static build() {
    return new BudgetNoneStrategy();
  }

  createBudget() {
    return undefined;
  }
  createBudgets() {
    return [];
  }
}
export default BudgetNoneStrategy;
