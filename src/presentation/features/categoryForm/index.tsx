import React, { forwardRef, Suspense, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import KeyboardAwareLayout, { useKeyboardOffsetContext } from '../../components/KeyboardAwareLayout';
import KeyboardSimpleBar from '../../components/KeyboardSimpleBar';
import { useBudgetingCategoryMutation } from '../../usecase/mutation/budgeting-category/mutation';
import { BudgetStrategyBase } from '../../usecase/mutation/budgeting-category/types';

import BudgetContent from './components/BudgetContent';
import CategoryNameItem from './components/CategoryNameItem';
import IconItem from './components/IconItem';
import { StoreProvider, useStoreContext } from './context/StoreContext';

export type CategoryBudgetFormRef = {
  save: () => boolean;
};
type Props = {
  categoryId?: string;
  onStateChange?: (isDirty: boolean, isValid: boolean) => void;
};
const CategoryBudgetForm = forwardRef<CategoryBudgetFormRef, Props>((props, ref) => {
  const { styles, theme } = useStyles(stylesheet);
  const offset = useKeyboardOffsetContext();
  const { selectedItemStore, formStore } = useStoreContext();

  const queryClient = useQueryClient();
  const createCategoryMutation = useBudgetingCategoryMutation.create(queryClient);
  const updateCategoryMutation = useBudgetingCategoryMutation.update(queryClient);

  useImperativeHandle(ref, () => ({
    save: () => {
      const canSave = formStore.isDirty() && formStore.isValid();
      const context = formStore.getContext();
      const formData = formStore.form;
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

  useEffect(() => {
    props.onStateChange && formStore.subscribe(props.onStateChange);
  }, []);

  const onPressDone = useCallback(() => {
    selectedItemStore.selected = undefined;
  }, []);

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={offset + 40}>
        <ScrollView
          style={styles.container}
          contentInset={{ bottom: theme.spacing['x12'] }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.upperArea}>
            <IconItem />
            <CategoryNameItem />
          </View>
          <View style={styles.budgetArea}>
            <BudgetContent />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardSimpleBar offset={offset} onPressDone={onPressDone} />
    </>
  );
});

const CategoryBudgetFormWrapper = forwardRef<CategoryBudgetFormRef, Props>((props, ref) => {
  const instanceKey = useRef(Math.random());
  return (
    <KeyboardAwareLayout>
      <Suspense>
        <StoreProvider categoryId={props.categoryId} refreshKey={instanceKey.current}>
          <CategoryBudgetForm ref={ref} {...props} />
        </StoreProvider>
      </Suspense>
    </KeyboardAwareLayout>
  );
});

export default CategoryBudgetFormWrapper;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.layer1,
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing['x6'],
  },
  upperArea: {
    flexDirection: 'row',
    gap: theme.spacing.x2,
  },
  budgetArea: {
    marginTop: theme.spacing['x7'],
  },
  toolbar: {
    width: '100%',
    height: 44,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  toolbarContent: {
    backgroundColor: 'red',
    height: '100%',
  },
}));
