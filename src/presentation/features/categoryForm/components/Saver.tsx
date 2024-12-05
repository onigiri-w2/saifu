import { forwardRef, useImperativeHandle } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useBudgetingCategoryMutation } from '@/src/presentation/usecase/mutation/budgeting-category/mutation';
import { BudgetStrategyBase } from '@/src/presentation/usecase/mutation/budgeting-category/types';

import { useStoreContext } from '../context/StoreContext';
import { CategoryBudgetFormRef } from '../types';

const Saver = forwardRef<CategoryBudgetFormRef, object>((_, ref) => {
  const { formDataStore } = useStoreContext();

  const queryClient = useQueryClient();
  const createCategoryMutation = useBudgetingCategoryMutation.create(queryClient);
  const updateCategoryMutation = useBudgetingCategoryMutation.update(queryClient);

  useImperativeHandle(ref, () => ({
    save: () => {
      const canSave = formDataStore.isDirty() && formDataStore.isValid();
      const context = formDataStore.getContext();
      const formData = formDataStore.form;
      if (!canSave) return false;

      const strategyType = formData.budgetPlan.selectedStrategyType;
      let strategy: BudgetStrategyBase = { type: 'none' };
      if (strategyType === 'regularly') {
        strategy = {
          type: 'regularly',
          cycle: formData.budgetPlan.strategyInputs.regularly.cycle,
          amount: formData.budgetPlan.strategyInputs.regularly.amount,
          tempAmount: formData.budgetPlan.strategyInputs.regularly.tempAmount,
        };
      }

      if (context.mode === 'update') {
        updateCategoryMutation.mutate({
          category: {
            id: context.categoryId,
            name: formData.categoryName,
            iconName: formData.iconName,
            iconColor: formData.iconColor,
          },
          budgetPlan: {
            id: context.budgetPlanId,
            strategy,
          },
        });
      } else {
        createCategoryMutation.mutate({
          category: {
            name: formData.categoryName,
            iconName: formData.iconName,
            iconColor: formData.iconColor,
          },
          budgetPlan: {
            strategy,
          },
        });
      }

      return true;
    },
  }));

  return null;
});
export default Saver;
