import { useRef, useEffect } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { TransactionType } from '@/src/domain/model/aggregation/transaction';
import KeyboardAwareLayout from '@/src/presentation/components/KeyboardAwareLayout';
import { CategoryListContext } from '@/src/presentation/features/expenseForm/context/CategoryListContext';
import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

import FormView from '../../../extended-category/components/CategoryForm/components/FormView';

import { StoreContext } from './context/StoreContext';
import { createFormDataStore } from './store/form.store';
import { FormDataStore } from './type';

type CreateTransactionFormProps = {
  transactionType: TransactionType;
};
export const CreateTransactionForm = ({ transactionType }: CreateTransactionFormProps) => {
  const categoryQuery = useSuspenseQuery(QueryOptions.transactionCategory.list());
  const categoryType = transactionType === 'expense' ? 'expenseCategory' : 'incomeCategory';
  const typedCategories = categoryQuery.data.filter((c) => c.type === categoryType);

  const defaultCategoryId = typedCategories[0]?.id.value;
  const formDataStore = useRef<FormDataStore>();
  if (!formDataStore.current) {
    formDataStore.current = createFormDataStore(undefined, defaultCategoryId);
  }

  useEffect(() => {
    // if (!formDataStore.current)
  }, []);

  useEffect(() => {
    if (!formDataStore.current) return;

    const form = formDataStore.current.form;
    formDataStore.current.form = {
      ...form,
      categoryId: defaultCategoryId,
    };
  }, [categoryType]);

  return (
    <KeyboardAwareLayout>
      <CategoryListContext.Provider value={typedCategories}>
        <StoreContext.Provider value={{ formDataStore: formDataStore.current }}>
          <FormView mode="create" />
        </StoreContext.Provider>
      </CategoryListContext.Provider>
    </KeyboardAwareLayout>
  );
};
