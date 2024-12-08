import React, { forwardRef, useEffect, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { withSuspenseRef } from '../../components/hoc/withSuspense';
import KeyboardAwareLayout from '../../components/KeyboardAwareLayout';
import { queryOptions } from '../../usecase/query';

import FormView from './components/FormView';
import Saver from './components/Saver';
import { StoreContext } from './context/StoreContext';
import { FormDataStore, createFormDataStore } from './store/form.store';
import { createFormFocusStore, FormFocusStore } from './store/selectedItem.store';
import { CategoryBudgetFormRef } from './types';

type Props = {
  categoryId?: string;
  onStateChange?: (isDirty: boolean, isValid: boolean) => void;
};
const CategoryForm = forwardRef<CategoryBudgetFormRef, Props>((props, ref) => {
  // categoryIdがマウント中に変わることないという前提で条件分岐内でhook使用
  const { data } = props.categoryId
    ? useSuspenseQuery(queryOptions.category.detail(props.categoryId))
    : { data: undefined };

  const formDataStore = useRef<FormDataStore>();
  if (!formDataStore.current) {
    formDataStore.current = createFormDataStore(props.categoryId ? data : undefined);
  }

  const formFocusStore = useRef<FormFocusStore>();
  if (!formFocusStore.current) formFocusStore.current = createFormFocusStore();

  useEffect(() => {
    props.onStateChange && formDataStore.current?.subscribe(props.onStateChange);
  }, []);

  return (
    <KeyboardAwareLayout>
      <StoreContext.Provider value={{ formDataStore: formDataStore.current, formFocusStore: formFocusStore.current }}>
        <FormView />
        <Saver ref={ref} />
      </StoreContext.Provider>
    </KeyboardAwareLayout>
  );
});

export default React.memo(withSuspenseRef(CategoryForm));
