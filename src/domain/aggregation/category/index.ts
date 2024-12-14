import uuid from 'react-native-uuid';

import { DomainValidationError } from '../../error';

import { IconColor } from './types/iconColor';
import { IconName } from './types/iconName';

const LIMIT = {
  maxNameLength: 50,
};

class Category {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly iconName: IconName,
    public readonly iconColor: IconColor,
  ) {
    this._validate();
  }

  static create(name: string, iconName: IconName, iconColor: IconColor) {
    const id = uuid.v4().toString();
    return new Category(id, name, iconName, iconColor);
  }

  static build(id: string, name: string, iconName: IconName, iconColor: IconColor) {
    return new Category(id, name, iconName, iconColor);
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
export default Category;
