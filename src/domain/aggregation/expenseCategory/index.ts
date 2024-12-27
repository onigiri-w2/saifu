import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';
import { IconColor } from '../../types/categoryIconColor';
import { IconName } from '../../types/categoryIconName';

const LIMIT = {
  maxNameLength: 50,
};

export class ExpenseCategoryId {
  _expenseCategoryIdBrand!: never;
  private constructor(public readonly value: string) {}

  static build(id: string) {
    return new ExpenseCategoryId(id);
  }
  static create() {
    const value = uuid.v4().toString();
    return new ExpenseCategoryId(value);
  }

  equals(other: ExpenseCategoryId) {
    return this.value === other.value;
  }
}

class ExpenseCategory {
  private constructor(
    public readonly id: ExpenseCategoryId,
    public readonly name: string,
    public readonly iconName: IconName,
    public readonly iconColor: IconColor,
  ) {
    this._validate();
  }

  static create(name: string, iconName: IconName, iconColor: IconColor) {
    return new ExpenseCategory(ExpenseCategoryId.create(), name, iconName, iconColor);
  }

  static build(id: ExpenseCategoryId, name: string, iconName: IconName, iconColor: IconColor) {
    return new ExpenseCategory(id, name, iconName, iconColor);
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
export default ExpenseCategory;
