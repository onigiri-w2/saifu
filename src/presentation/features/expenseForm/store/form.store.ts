import { proxy } from 'valtio';
import { deepClone } from 'valtio/utils';

import Expense from '@/src/domain/aggregation/expense';

import { FormDataStore } from '../type';

export const createFormDataStore = (source?: Expense, defaultCategoryId?: string) => {
  const initialState = createInitialState(source, defaultCategoryId);

  return proxy<FormDataStore>({ form: deepClone(initialState) });
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
