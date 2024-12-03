import uuid from 'react-native-uuid';

import { ToDTO } from '../../types';
import Money from '../../valueobject/money';

import BudgetNoneStrategy from './strategy/none';
import BudgetRegularlyStrategy from './strategy/regularly';
import { BudgetCycle, Strategy } from './types';

export type BudgetPlanDTO = ToDTO<BudgetPlan>;
class BudgetPlan {
  private constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly strategy: Strategy,
  ) {}

  static create(categoryId: string, strategy: Strategy) {
    const id = uuid.v4().toString();
    return new BudgetPlan(id, categoryId, strategy);
  }
  static build(id: string, categoryId: string, strategy: Strategy) {
    return new BudgetPlan(id, categoryId, strategy);
  }
  static withNone(categoryId: string) {
    return new BudgetPlan(uuid.v4().toString(), categoryId, BudgetNoneStrategy.build());
  }
  static withRegularly(categoryId: string, cycle: BudgetCycle, amount: number) {
    return new BudgetPlan(uuid.v4().toString(), categoryId, BudgetRegularlyStrategy.build(Money.build(amount), cycle));
  }
}

export default BudgetPlan;
