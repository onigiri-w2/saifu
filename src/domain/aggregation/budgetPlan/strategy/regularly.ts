import Money from '../../../valueobject/money';
import { BudgetCycle, IBudgetRegularlyStrategy, Strategy } from '../types';

class BudgetRegularlyStrategy implements IBudgetRegularlyStrategy {
  public readonly type = 'regularly';
  private constructor(
    public readonly amount: Money,
    public readonly cycle: BudgetCycle,
    public readonly tempAmount: Money | undefined,
  ) {}

  static build(amount: Money, cycle: BudgetCycle, tempAmount?: Money) {
    return new BudgetRegularlyStrategy(amount, cycle, tempAmount);
  }
}
export default BudgetRegularlyStrategy;

export const isRegularlyStrategy = (strategy: Strategy): strategy is BudgetRegularlyStrategy => {
  return strategy.type === 'regularly';
};
