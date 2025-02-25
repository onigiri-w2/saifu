import uuid from 'react-native-uuid';

import Money from '../../valueobject/money';
import { TransactionCategoryId } from '../transactionCategory';

import BudgetRegularlyStrategy from './strategy/regularly';
import { BudgetCycle, Strategy } from './types';

class BudgetPlan {
  private constructor(
    public readonly id: BudgetPlanId,
    public readonly categoryIds: TransactionCategoryId[],
    public readonly strategy: Strategy,
  ) { }

  static create(categoryIds: TransactionCategoryId[], strategy: Strategy) {
    return new BudgetPlan(BudgetPlanId.create(), categoryIds, strategy);
  }
  static build(id: BudgetPlanId, categoryIds: TransactionCategoryId[], strategy: Strategy) {
    return new BudgetPlan(id, categoryIds, strategy);
  }
  static withRegularly(categoryIds: TransactionCategoryId[], cycle: BudgetCycle, amount: number, tempAmount?: number) {
    return new BudgetPlan(
      BudgetPlanId.create(),
      categoryIds,
      BudgetRegularlyStrategy.build(
        Money.build(amount),
        cycle,
        tempAmount !== undefined ? Money.build(tempAmount) : undefined,
      ),
    );
  }
}

export default BudgetPlan;
export class BudgetPlanId {
  _budgetPlanIdBrand!: never;
  private constructor(public readonly value: string) { }
  static build(id: string) {
    return new BudgetPlanId(id);
  }
  static create() {
    const id = uuid.v4().toString();
    return new BudgetPlanId(id);
  }
}
