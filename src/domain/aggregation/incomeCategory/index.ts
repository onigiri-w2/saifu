import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';
import { IconColor } from '../../types/categoryIconColor';
import { IconName } from '../../types/categoryIconName';

const LIMIT = {
  maxNameLength: 50,
};

export class IncomeCategoryId {
  _incomeCategoryIdBrand!: never;
  private constructor(public readonly value: string) {}

  static create() {
    const id = uuid.v4().toString();
    return new IncomeCategoryId(id);
  }
  static build(id: string) {
    return new IncomeCategoryId(id);
  }

  equals(other: IncomeCategoryId) {
    return this.value === other.value;
  }
}

class IncomeCategory {
  private constructor(
    public readonly id: IncomeCategoryId,
    public readonly name: string,
    public readonly iconName: IconName,
    public readonly iconColor: IconColor,
  ) {
    this._validate();
  }

  static create(name: string, iconName: IconName, iconColor: IconColor) {
    return new IncomeCategory(IncomeCategoryId.create(), name, iconName, iconColor);
  }

  static build(id: IncomeCategoryId, name: string, iconName: IconName, iconColor: IconColor) {
    return new IncomeCategory(id, name, iconName, iconColor);
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
export default IncomeCategory;
