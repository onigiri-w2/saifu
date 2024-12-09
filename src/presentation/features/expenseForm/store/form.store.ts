import { proxy, subscribe } from 'valtio';
import { deepClone } from 'valtio/utils';

import Expense from '@/src/domain/aggregation/expense';

import { FormDataState, FormDataStore } from '../type';

export const createFormDataStore = (source?: Expense, defaultCategoryId?: string) => {
  const initialState = createInitialState(source, defaultCategoryId);
  const subscribers: Set<(isDirty: boolean, isValid: boolean) => void> = new Set();

  const store = proxy<FormDataStore>({
    form: deepClone(initialState),
    isDirty() {
      return !isEqual(initialState, this.form);
    },
    isValid() {
      return validate(this.form);
    },
    subscribe(callback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
  });

  subscribe(store.form, () => {
    const isDirty = store.isDirty();
    const isValid = store.isValid();
    subscribers.forEach((callback) => {
      callback(isDirty, isValid);
    });
  });

  return store;
};
const validate = (form: FormDataState): boolean => {
  if (!form.categoryId) return false;
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
const createInitialState = (source?: Expense, defaultCategoryId?: string): FormDataStore['form'] => {
  if (!source) {
    return {
      amount: 0,
      timestamp: new Date().getTime(),
      categoryId: defaultCategoryId,
      memo: '',
    };
  }
  return {
    amount: source.amount.value,
    timestamp: source.date.getTime(),
    categoryId: source.categoryId ?? defaultCategoryId,
    memo: source.memo,
  };
};
