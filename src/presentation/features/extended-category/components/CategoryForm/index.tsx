import React, { forwardRef, useRef, useEffect } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { subscribe } from 'valtio';

import { TransactionCategoryType } from '@/src/domain/model/aggregation/transactionCategory';
import KeyboardAwareLayout from '@/src/presentation/components/KeyboardAwareLayout';
import { ExtendedCategoryFormRef } from '@/src/presentation/temp/categoryForm/types';
import { QueryOptions } from '@/src/presentation/usecase/query/query-options';

import CreateSaver from './components/CreateSaver';
import FormView from './components/FormView';
import UpdateSaver from './components/UpdateSaver';
import { StoreContext } from './context/StoreContext';
import { FormDataStore, createFormDataStore } from './store/form.store';

type CreateCategoryProps = {
  onStateChange?: (isDirty: boolean, isValid: boolean) => void;
  categoryType: TransactionCategoryType;
};
export const CreateCategoryForm = React.memo(
  forwardRef<ExtendedCategoryFormRef, CreateCategoryProps>((props, ref) => {
    const formDataStore = useRef<FormDataStore>();
    if (!formDataStore.current) formDataStore.current = createFormDataStore();

    useEffect(() => {
      if (!props.onStateChange || !formDataStore.current) return;
      subscribe(formDataStore, () => {
        const isDirty = formDataStore.current?.isDirty();
        const isValid = formDataStore.current?.isValid();
        if (isDirty === undefined || isValid === undefined) return;
        props.onStateChange?.(isDirty, isValid);
      });
    }, []);

    return (
      <KeyboardAwareLayout>
        <StoreContext.Provider value={{ formDataStore: formDataStore.current }}>
          <FormView />
          <CreateSaver ref={ref} categoryType={props.categoryType} />
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
  forwardRef<ExtendedCategoryFormRef, UpdateCategoryProps>((props, ref) => {
    const categoryQuery = useSuspenseQuery(QueryOptions.transactionCategory.detail(props.categoryId));

    const formDataStore = useRef<FormDataStore>();
    if (!formDataStore.current) formDataStore.current = createFormDataStore(categoryQuery.data);

    useEffect(() => {
      if (!props.onStateChange || !formDataStore.current) return;
      subscribe(formDataStore, () => {
        const isDirty = formDataStore.current?.isDirty();
        const isValid = formDataStore.current?.isValid();
        if (isDirty === undefined || isValid === undefined) return;
        props.onStateChange?.(isDirty, isValid);
      });
    }, []);

    return (
      <KeyboardAwareLayout>
        <StoreContext.Provider value={{ formDataStore: formDataStore.current }}>
          <FormView />
          <UpdateSaver ref={ref} categoryType={categoryQuery.data.type} />
        </StoreContext.Provider>
      </KeyboardAwareLayout>
    );
  }),
);
