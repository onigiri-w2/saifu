import { useEffect, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import KeyboardAwareLayout from '../../components/KeyboardAwareLayout';
import { queryOptions } from '../../usecase/query';

import FormView from './components/FormView';
import { CategoryListContext } from './context/CategoryListContext';
import { FormStoreContext } from './context/FormStoreContext';
import { createFormDataStore } from './store/form.store';
import { FormDataStore, OnRemovedFunction, OnSavedFunction } from './type';

type CreateExpenseFormProps = {
  onSaved: OnSavedFunction;
};
export const CreateExpenseForm = withSuspense(({ onSaved }: CreateExpenseFormProps) => {
  const categoryQuery = useSuspenseQuery(queryOptions.category.list());

  const store = useRef<FormDataStore>();
  if (!store.current) {
    store.current = createFormDataStore(undefined, categoryQuery.data[0]?.category.id);
  }

  // TODO: 多分これ期待通りの挙動しないよ。
  useEffect(() => {
    if (!store.current) return;
    const newCategoryId = categoryQuery.data[0]?.category.id;
    if (store.current.form.categoryId === newCategoryId) return;

    store.current.form.categoryId = newCategoryId;
  }, [categoryQuery]);

  return (
    <KeyboardAwareLayout>
      <CategoryListContext.Provider value={categoryQuery.data.map((c) => c.category)}>
        <FormStoreContext.Provider value={store.current}>
          <FormView mode="create" onSaved={onSaved} />
        </FormStoreContext.Provider>
      </CategoryListContext.Provider>
    </KeyboardAwareLayout>
  );
});

type UpdateExpenseFormProps = {
  expenseId: string;
  onSaved: OnSavedFunction;
  onRemoved: OnRemovedFunction;
};
export const UpdateExpenseForm = ({ expenseId, onSaved, onRemoved }: UpdateExpenseFormProps) => {
  const categoryQuery = useSuspenseQuery(queryOptions.category.list());
  const expenseQuery = useSuspenseQuery(queryOptions.expense.detail(expenseId));

  if (!expenseQuery.data) return null;

  const store = useRef<FormDataStore>();
  if (!store.current) {
    store.current = createFormDataStore(expenseQuery.data);
  }

  return (
    <KeyboardAwareLayout>
      <CategoryListContext.Provider value={categoryQuery.data.map((c) => c.category)}>
        <FormStoreContext.Provider value={store.current}>
          <FormView mode="update" onSaved={onSaved} onRemoved={onRemoved} />
        </FormStoreContext.Provider>
      </CategoryListContext.Provider>
    </KeyboardAwareLayout>
  );
};
