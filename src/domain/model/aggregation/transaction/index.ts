import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../../error';
import Money from '../../valueobject/money';
import { TransactionCategoryId } from '../transactionCategory';

export type TransactionType = 'income' | 'expense';
class Transaction {
  private constructor(
    public id: TransactionId,
    public categoryId: TransactionCategoryId,
    public amount: Money,
    public date: Date,
    public memo: string,
    public type: TransactionType,
  ) {
    this._validate();
  }

  static create(categoryId: TransactionCategoryId, amount: Money, date: Date, memo: string, type: TransactionType) {
    return new Transaction(TransactionId.create(), categoryId, amount, date, memo, type);
  }

  static build(
    id: TransactionId,
    categoryId: TransactionCategoryId,
    amount: Money,
    date: Date,
    memo: string,
    type: TransactionType,
  ) {
    return new Transaction(id, categoryId, amount, date, memo, type);
  }

  private _validate() {
    if (this.memo.length > 500) {
      throw new DomainValidationError('メモは500文字以下である必要があります', {
        context: { memo: this.memo },
      });
    }
  }
}
export default Transaction;

export class TransactionId {
  _transactionIdBrand!: never;
  private constructor(public value: string) { }

  static build(id: string) {
    return new TransactionId(id);
  }
  static create() {
    const id = uuid.v4().toString();
    return new TransactionId(id);
  }

  equals(other: TransactionId) {
    return this.value === other.value;
  }
}
