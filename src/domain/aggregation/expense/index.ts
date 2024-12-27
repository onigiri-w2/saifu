import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';
import Money from '../../valueobject/money';
import { ExpenseCategoryId } from '../expenseCategory';

export class ExpenseId {
  _expenseIdBrand!: never;
  private constructor(public value: string) {}

  static build(id: string) {
    return new ExpenseId(id);
  }
  static create() {
    const id = uuid.v4().toString();
    return new ExpenseId(id);
  }

  equals(other: ExpenseId) {
    return this.value === other.value;
  }
}

class Expense {
  private constructor(
    public id: ExpenseId,
    public categoryId: ExpenseCategoryId,
    public amount: Money,
    public date: Date,
    public memo: string,
  ) {
    this._validate();
  }

  static create(categoryId: ExpenseCategoryId, amount: Money, date: Date, memo: string) {
    return new Expense(ExpenseId.create(), categoryId, amount, date, memo);
  }

  static build(id: ExpenseId, categoryId: ExpenseCategoryId, amount: Money, date: Date, memo: string) {
    return new Expense(id, categoryId, amount, date, memo);
  }

  private _validate() {
    if (this.memo.length > 500) {
      throw new DomainValidationError('メモは500文字以下である必要があります', {
        context: { memo: this.memo },
      });
    }
  }
}
export default Expense;
