import uuid from 'react-native-uuid';

import Money from '../../valueobject/money';
import { ExpenseCategoryId } from '../expenseCategory';

import BudgetNoneStrategy from './strategy/none';
import BudgetRegularlyStrategy from './strategy/regularly';
import { BudgetCycle, Strategy } from './types';

export class BudgetPlanId {
  _budgetPlanIdBrand!: never;
  private constructor(public readonly value: string) {}
  static build(id: string) {
    return new BudgetPlanId(id);
  }
  static create() {
    const id = uuid.v4().toString();
    return new BudgetPlanId(id);
  }
}

class BudgetPlan {
  private constructor(
    public readonly id: BudgetPlanId,
    public readonly categoryId: ExpenseCategoryId,
    public readonly strategy: Strategy,
  ) {}

  static create(categoryId: ExpenseCategoryId, strategy: Strategy) {
    return new BudgetPlan(BudgetPlanId.create(), categoryId, strategy);
  }
  static build(id: BudgetPlanId, categoryId: ExpenseCategoryId, strategy: Strategy) {
    return new BudgetPlan(id, categoryId, strategy);
  }
  static withNone(categoryId: ExpenseCategoryId) {
    return new BudgetPlan(BudgetPlanId.create(), categoryId, BudgetNoneStrategy.build());
  }
  static withRegularly(categoryId: ExpenseCategoryId, cycle: BudgetCycle, amount: number, tempAmount?: number) {
    return new BudgetPlan(
      BudgetPlanId.create(),
      categoryId,
      BudgetRegularlyStrategy.build(
        Money.build(amount),
        cycle,
        tempAmount !== undefined ? Money.build(tempAmount) : undefined,
      ),
    );
  }
}

export default BudgetPlan;
