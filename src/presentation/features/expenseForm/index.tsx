import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { useSuspenseQuery } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';

import FormView from './components/FormView';
import { FormStoreContext } from './context/FormStoreContext';
import { createFormDataStore } from './store/form.store';
import { FormDataStore } from './type';

export const NewExpenseForm = withSuspense(() => {
  const query = useSuspenseQuery(queryOptions.category.list());

  const store = useRef<FormDataStore>();
  if (!store.current) {
    store.current = createFormDataStore(undefined, query.data[0]?.category.id);
  }

  useEffect(() => {
    if (!store.current) return;
    const newCategoryId = query.data[0]?.category.id;
    if (store.current.form.categoryId === newCategoryId) return;

    store.current.form.categoryId = newCategoryId;
  }, [query]);

  return (
    <FormStoreContext.Provider value={store.current}>
      <FormView />
    </FormStoreContext.Provider>
  );
});

type UpdateExpenseFormProps = {
  expenseId: string;
};
export const UpdateExpenseForm = ({ expenseId }: UpdateExpenseFormProps) => {
  return (
    <View>
      <Text>fire</Text>
    </View>
  );
};
