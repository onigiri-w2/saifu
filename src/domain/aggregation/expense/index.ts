import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';
import Money from '../../valueobject/money';

class Expense {
  private constructor(
    public id: string,
    public categoryId: string,
    public amount: Money,
    public date: Date,
    public memo: string,
  ) {
    this._validate();
  }

  static create(categoryId: string, amount: Money, date: Date, memo: string) {
    const id = uuid.v4().toString();
    return new Expense(id, categoryId, amount, date, memo);
  }

  static build(id: string, categoryId: string, amount: Money, date: Date, memo: string) {
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
