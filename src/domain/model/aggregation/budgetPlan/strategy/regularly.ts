import Money from '../../../valueobject/money';
import { BudgetCycle, IBudgetRegularlyStrategy, Strategy } from '../types';

class BudgetRegularlyStrategy implements IBudgetRegularlyStrategy {
  public readonly type = 'regularly';
  private constructor(
    public readonly amount: Money,
    public readonly cycle: BudgetCycle,
    public readonly tempAmount: Money | undefined,
  ) { }

  static build(amount: Money, cycle: BudgetCycle, tempAmount?: Money) {
    return new BudgetRegularlyStrategy(amount, cycle, tempAmount);
  }

  equals(other: IBudgetRegularlyStrategy): boolean {
    if (this.type !== other.type) return false;
    if (!this.amount.equals(other.amount)) return false;
    if (this.cycle !== other.cycle) return false;
    if (this.tempAmount === undefined && other.tempAmount !== undefined) return false;
    if (this.tempAmount !== undefined && other.tempAmount === undefined) return false;
    if (this.tempAmount !== undefined && other.tempAmount !== undefined && !this.tempAmount.equals(other.tempAmount)) {
      return false;
    }
    return true;
  }
}
export default BudgetRegularlyStrategy;

export const isRegularlyStrategy = (strategy: Strategy): strategy is BudgetRegularlyStrategy => {
  return strategy.type === 'regularly';
};
