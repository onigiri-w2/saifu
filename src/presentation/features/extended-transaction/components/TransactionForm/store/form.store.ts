import { proxy } from 'valtio';
import { deepClone } from 'valtio/utils';

import Transaction from '@/src/domain/model/aggregation/transaction';

import { FormDataStore, FormDataState } from '../type';

export const createFormDataStore = (source?: Transaction, defaultCategoryId?: string) => {
  const initialState = createInitialState(source, defaultCategoryId);

  const store = proxy<FormDataStore>({
    form: deepClone(initialState),
    isDirty() {
      return !isEqual(initialState, this.form);
    },
    isValid() {
      return validate(this.form);
    },
    updateTimestamp(timestamp: number) {
      const date = new Date(timestamp);
      const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.form.timestamp = onlyDate.getTime();
    },
  });

  return store;
};
const validate = (form: FormDataState): boolean => {
  if (form.categoryId === undefined) return false;
  return true;
};

const isEqual = (a: FormDataState, b: FormDataState): boolean => {
  // 基本フィールドの比較
  if (a.amount !== b.amount) return false;
  if (a.timestamp !== b.timestamp) return false;
  if (a.categoryId !== b.categoryId) return false;
  if (a.memo !== b.memo) return false;

  // strategyTypeがregularly以外の場合は、
  // 基本フィールドの比較だけで十分なのでtrueを返す
  return true;
};
const createInitialState = (source?: Transaction, defaultCategoryId?: string): FormDataStore['form'] => {
  const now = new Date();
  if (!source) {
    return {
      amount: 0,
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
      categoryId: defaultCategoryId,
      memo: '',
    };
  }
  return {
    amount: source.amount.value,
    timestamp: source.date.getTime(),
    categoryId: source.categoryId?.value ?? defaultCategoryId,
    memo: source.memo,
  };
};
