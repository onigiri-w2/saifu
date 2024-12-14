import { IBudgetNoneStrategy } from '../types';

class BudgetNoneStrategy implements IBudgetNoneStrategy {
  public readonly type = 'none';

  private constructor() { }

  static build() {
    return new BudgetNoneStrategy();
  }

  createBudget() {
    return undefined;
  }
  createBudgets() {
    return [];
  }

  isSameValue(other: IBudgetNoneStrategy): boolean {
    return other.type === this.type;
  }
}
export default BudgetNoneStrategy;
