import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../../error';
import { IconColor } from '../../types/categoryIconColor';
import { IconName } from '../../types/categoryIconName';

const LIMIT = {
  maxNameLength: 50,
};

export type TransactionCategoryType = 'expenseCategory' | 'incomeCategory';
class TransactionCategory {
  private constructor(
    public readonly id: TransactionCategoryId,
    public readonly name: string,
    public readonly iconName: IconName,
    public readonly iconColor: IconColor,
    public readonly type: TransactionCategoryType,
  ) {
    this._validate();
  }

  static create(name: string, iconName: IconName, iconColor: IconColor, type: TransactionCategoryType) {
    return new TransactionCategory(TransactionCategoryId.create(), name, iconName, iconColor, type);
  }

  static build(
    id: TransactionCategoryId,
    name: string,
    iconName: IconName,
    iconColor: IconColor,
    type: TransactionCategoryType,
  ) {
    return new TransactionCategory(id, name, iconName, iconColor, type);
  }

  update(categoryName: string, iconName: IconName, iconColor: IconColor) {
    return new TransactionCategory(this.id, categoryName, iconName, iconColor, this.type);
  }

  private _validate() {
    if (this.name.length > LIMIT.maxNameLength && this.name.trim() === '') {
      throw new DomainValidationError(`カテゴリの名前の長さは1以上${LIMIT.maxNameLength}以下にしてください`, {
        context: {
          name: this.name,
        },
      });
    }
  }
}
export default TransactionCategory;

export class TransactionCategoryId {
  _transactionCategoryIdBrand!: never;
  private constructor(public readonly value: string) { }

  static build(id: string) {
    return new TransactionCategoryId(id);
  }
  static create() {
    const value = uuid.v4().toString();
    return new TransactionCategoryId(value);
  }

  equals(other: TransactionCategoryId) {
    return this.value === other.value;
  }
}
