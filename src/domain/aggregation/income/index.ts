import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';
import Money from '../../valueobject/money';
import { IncomeCategoryId } from '../incomeCategory';

export class IncomeId {
  _incomeIdBrand!: never;
  private constructor(public readonly value: string) {}

  static create() {
    const id = uuid.v4().toString();
    return new IncomeId(id);
  }
  static build(id: string) {
    return new IncomeId(id);
  }

  equals(other: IncomeId) {
    return this.value === other.value;
  }
}

class Income {
  private constructor(
    public id: IncomeId,
    public categoryId: IncomeCategoryId,
    public amount: Money,
    public date: Date,
    public memo: string,
  ) {
    this._validate();
  }

  static create(categoryId: IncomeCategoryId, amount: Money, date: Date, memo: string) {
    return new Income(IncomeId.create(), categoryId, amount, date, memo);
  }

  static build(id: IncomeId, categoryId: IncomeCategoryId, amount: Money, date: Date, memo: string) {
    return new Income(id, categoryId, amount, date, memo);
  }

  private _validate() {
    if (this.memo.length > 500) {
      throw new DomainValidationError('メモは500文字以下である必要があります', {
        context: { memo: this.memo },
      });
    }
  }
}
export default Income;
