import { proxy } from 'valtio';
import { deepClone } from 'valtio/utils';

import Expense from '@/src/domain/aggregation/expense';

import { FormDataStore } from '../type';

export const createFormDataStore = (source?: Expense, defaultCategoryId?: string) => {
  const initialState = createInitialState(source, defaultCategoryId);

  // const subscribers: Set<(isDirty: boolean, isValid: boolean) => void> = new Set();
  // const tempAmountBuffer = 0;
  //
  const store = proxy<FormDataStore>({ form: deepClone(initialState) });
  // subscribe(store.form, () => {});

  return store;
};

const createInitialState = (source?: Expense, defaultCategoryId?: string): FormDataStore['form'] => {
  if (!source) {
    return {
      amount: 0,
      date: new Date(),
      categoryId: defaultCategoryId,
      memo: '',
    };
  }
  return {
    amount: source.amount.value,
    date: source.date,
    categoryId: source.categoryId ?? defaultCategoryId,
    memo: source.memo,
  };
};
