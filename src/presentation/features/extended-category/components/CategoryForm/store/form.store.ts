import { proxy } from 'valtio';
import { deepClone } from 'valtio/utils';

import TransactionCategory from '@/src/domain/model/aggregation/transactionCategory';
import { IconColor } from '@/src/domain/model/types/categoryIconColor';
import { IconName } from '@/src/domain/model/types/categoryIconName';

export const createFormDataStore = (source?: TransactionCategory) => {
  const initialState = createInitialState(source);

  const store = proxy<FormDataStore>({
    form: deepClone(initialState),
    isDirty() {
      return !isEqual(initialState, this.form);
    },
    isValid() {
      return validate(this.form);
    },
  });

  return store;
};

const createInitialState = (source?: TransactionCategory): FormDataState => {
  if (!source) return DEFAULT_STATE;

  const baseState: FormDataState = {
    categoryName: source.name,
    iconName: source.iconName,
    iconColor: source.iconColor,
  };

  return baseState;
};

const isEqual = (a: FormDataState, b: FormDataState): boolean => {
  // 基本フィールドの比較
  if (a.categoryName !== b.categoryName || a.iconName !== b.iconName || a.iconColor !== b.iconColor) {
    return false;
  }
  return true;
};

const validate = (form: FormDataState): boolean => {
  if (!form.categoryName) return false;
  return true;
};

export type FormDataState = {
  categoryName: string;
  iconName: IconName;
  iconColor: IconColor;
};
export type FormDataStore = {
  form: FormDataState;
  isDirty: () => boolean;
  isValid: () => boolean;
};
const DEFAULT_STATE: FormDataState = {
  categoryName: '',
  iconName: 'fork',
  iconColor: '#E53E3E',
};
