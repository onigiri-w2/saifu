import { forwardRef, useImperativeHandle } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useSnapshot } from 'valtio';

import { TransactionCategoryType } from '@/src/domain/model/aggregation/transactionCategory';
import { ExtendedCategoryFormRef } from '@/src/presentation/features/categoryForm/types';
import { useMutations } from '@/src/presentation/usecase/mutation';

import { useStoreContext } from '../context/StoreContext';

type Props = {
  categoryType: TransactionCategoryType;
};

const CreateSaver = forwardRef<ExtendedCategoryFormRef, Props>((props, ref) => {
  const { formDataStore } = useStoreContext();
  const form = useSnapshot(formDataStore.form);

  const queryClient = useQueryClient();
  const createMutation = useMutations.category.create(queryClient);

  useImperativeHandle(ref, () => ({
    save: () => {
      const isValid = formDataStore.isValid();
      const isDirty = formDataStore.isDirty();
      if (!isValid || !isDirty) return;

      createMutation.mutate({
        category: {
          name: form.categoryName,
          iconName: form.iconName,
          iconColor: form.iconColor,
          type: props.categoryType,
        },
      });
    },
  }));
  return null;
});

export default CreateSaver;
