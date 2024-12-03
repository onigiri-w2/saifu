import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { budgetCycleLabels } from '@/src/domain/aggregation/budgetPlan/types';
import { Swipeable, SwipeableRef } from '@/src/presentation/components/Swipable';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { numberFormat } from '@/src/presentation/i18n/format';
import { BudgetingCategory } from '@/src/presentation/usecase/query/budgeting-category/functions';
import { NotImplementedError } from '@/src/utils/errors';

import { useEnrichedCategoryListContext } from '../../context';

import { ROW_HEIGHT, CATEGORY_ICON_SIZE } from './constants';
import DeleteAction from './DeleteAction';

type Props = {
  budgetingCategory: BudgetingCategory;
  onPress: (categoryId: string) => void;
};
function Row({ budgetingCategory, onPress }: Props) {
  const swipeableRef = useRef<SwipeableRef>(null);
  const { styles } = useStyles(stylesheet);

  const { category, budgetPlan } = budgetingCategory;

  const { label, value } = useMemo(() => {
    if (!budgetPlan) return { label: '予算なし', value: undefined };

    switch (budgetPlan.strategy.type) {
      case 'regularly': {
        const amount = budgetPlan.strategy.tempAmount?.value ?? budgetPlan.strategy.amount.value;
        const cycleLabel = budgetCycleLabels[budgetPlan.strategy.cycle];
        const value = `${numberFormat(amount, true)} / ${cycleLabel}`;
        return { label: '定期予算', value };
      }
      case 'none': {
        return { label: '予算なし', value: undefined };
      }
      default: {
        throw new NotImplementedError('Strategy', budgetPlan.strategy);
      }
    }
  }, [budgetPlan]);

  const store = useEnrichedCategoryListContext();
  const isOpen = useSnapshot(store).rowCollapseStates.get(category.id);

  useEffect(() => {
    if (isOpen) {
    } else {
      swipeableRef.current?.close();
    }
  }, [isOpen]);

  const deleteAction = useMemo(() => <DeleteAction categoryId={category.id} />, [category.id]);
  const handlePress = useCallback(() => {
    onPress(category.id);
  }, []);

  return (
    <Swipeable
      ref={swipeableRef}
      leftThreshold={-ROW_HEIGHT}
      rightThreshold={0}
      righActions={deleteAction}
      onPress={handlePress}
      onOpen={() => {
        store.toggleRowCollapseState(category.id);
      }}
      onClose={() => {
        store.rowCollapseStates.set(category.id, false);
      }}
    >
      <View style={styles.container}>
        <View style={styles.categoryWrap}>
          <CategoryIcon iconName={category.iconName} iconColor={category.iconColor} size={CATEGORY_ICON_SIZE} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        <View style={styles.budgetPlanWrap}>
          <Text style={styles.budgetPlanLabel}>{label}</Text>
          {value && <Text style={styles.budgetPlanValue}>{value}</Text>}
        </View>
      </View>
    </Swipeable>
  );
}

export default React.memo(Row);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  categoryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  categoryName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  budgetPlanWrap: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  budgetPlanLabel: {
    fontSize: theme.fontSize['2xs'],
    color: theme.colors.text.secondary,
  },
  budgetPlanValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
  },
}));
