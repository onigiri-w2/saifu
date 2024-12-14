import { useEffect, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { assert } from '@/src/utils/errors';

import { withSuspense } from '../../components/hoc/withSuspense';
import KeyboardAwareLayout from '../../components/KeyboardAwareLayout';
import { queryOptions } from '../../usecase/query';

import FormView from './components/FormView';
import { ActionsContext } from './context/ActionsContext';
import { CategoryListContext } from './context/CategoryListContext';
import { FormStoreContext } from './context/FormStoreContext';
import { createFormDataStore } from './store/form.store';
import { FormDataStore, OnDirtyChangeFunction, OnRemovedFunction, OnSavedFunction } from './type';

type CreateExpenseFormProps = {
  onSaved: OnSavedFunction;
  onDirtyChange: OnDirtyChangeFunction;
};
export const CreateExpenseForm = withSuspense(({ onSaved, onDirtyChange }: CreateExpenseFormProps) => {
  const categoryQuery = useSuspenseQuery(queryOptions.category.list());

  const defaultCategoryId = categoryQuery.data[0]?.category.id;
  const store = useRef<FormDataStore>();
  if (!store.current) {
    store.current = createFormDataStore(undefined, defaultCategoryId);
  }

  useEffect(() => {
    store.current?.subscribe(onDirtyChange);
  }, []);

  return (
    <KeyboardAwareLayout>
      <ActionsContext.Provider value={{ onSaved }}>
        <CategoryListContext.Provider value={categoryQuery.data.map((c) => c.category)}>
          <FormStoreContext.Provider value={store.current}>
            <FormView mode="create" />
          </FormStoreContext.Provider>
        </CategoryListContext.Provider>
      </ActionsContext.Provider>
    </KeyboardAwareLayout>
  );
});

type UpdateExpenseFormProps = {
  expenseId: string;
  onSaved: OnSavedFunction;
  onRemoved: OnRemovedFunction;
  onDirtyChange: OnDirtyChangeFunction;
};
export const UpdateExpenseForm = ({ expenseId, onSaved, onRemoved, onDirtyChange }: UpdateExpenseFormProps) => {
  const categoryQuery = useSuspenseQuery(queryOptions.category.list());
  const expenseQuery = useSuspenseQuery(queryOptions.expense.detail(expenseId));

  // validation
  assert(expenseQuery.data !== undefined, 'Expense not found');
  assert(categoryQuery.data.length > 0, 'Category not found');

  const store = useRef<FormDataStore>();
  if (!store.current) {
    store.current = createFormDataStore(expenseQuery.data);
  }

  useEffect(() => {
    store.current?.subscribe(onDirtyChange);
  }, []);

  return (
    <KeyboardAwareLayout>
      <ActionsContext.Provider value={{ onSaved, onRemoved }}>
        <CategoryListContext.Provider value={categoryQuery.data.map((c) => c.category)}>
          <FormStoreContext.Provider value={store.current}>
            <FormView mode="update" />
          </FormStoreContext.Provider>
        </CategoryListContext.Provider>
      </ActionsContext.Provider>
    </KeyboardAwareLayout>
  );
};
