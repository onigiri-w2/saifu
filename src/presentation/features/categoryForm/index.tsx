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

type CreateCategoryProps = {
  onStateChange?: (isDirty: boolean, isValid: boolean) => void;
};
export const CreateCategoryForm = React.memo(
  forwardRef<CategoryBudgetFormRef, CreateCategoryProps>((props, ref) => {
    const formDataStore = useRef<FormDataStore>();
    if (!formDataStore.current) formDataStore.current = createFormDataStore();
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
  }),
);

type UpdateCategoryProps = {
  categoryId: string;
  onStateChange?: (isDirty: boolean, isValid: boolean) => void;
};
export const UpdateCategoryForm = React.memo(
  withSuspenseRef(
    forwardRef<CategoryBudgetFormRef, UpdateCategoryProps>((props, ref) => {
      const { data } = useSuspenseQuery(queryOptions.category.detail(props.categoryId));

      const formDataStore = useRef<FormDataStore>();
      if (!formDataStore.current) formDataStore.current = createFormDataStore(data);
      const formFocusStore = useRef<FormFocusStore>();
      if (!formFocusStore.current) formFocusStore.current = createFormFocusStore();

      useEffect(() => {
        props.onStateChange && formDataStore.current?.subscribe(props.onStateChange);
      }, []);

      return (
        <KeyboardAwareLayout>
          <StoreContext.Provider
            value={{ formDataStore: formDataStore.current, formFocusStore: formFocusStore.current }}
          >
            <FormView />
            <Saver ref={ref} />
          </StoreContext.Provider>
        </KeyboardAwareLayout>
      );
    }),
  ),
);
