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

import DeleteAction from './DeleteAction';

type Props = {
  budgetingCategory: BudgetingCategory;
  onPress: (categoryId: string) => void;
};
function Row({ budgetingCategory, onPress }: Props) {
  const swipeableRef = useRef<SwipeableRef>(null);
  const { styles, theme } = useStyles(stylesheet);

  const { category, budgetPlan } = budgetingCategory;

  const { label, value } = useMemo(() => {
    if (budgetPlan === undefined) return { label: '予算なし', value: undefined };

    switch (budgetPlan.strategy.type) {
      case 'regularly': {
        const amount = budgetPlan.strategy.tempAmount?.value ?? budgetPlan.strategy.amount.value;
        const cycleLabel = budgetCycleLabels[budgetPlan.strategy.cycle];
        const value = `${numberFormat(amount, true)} / ${cycleLabel}`;
        return { label: undefined, value };
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
  const isOpen = useSnapshot(store).rowCollapseStates.get(category.id.value);

  useEffect(() => {
    if (Boolean(isOpen) === false) {
      swipeableRef.current?.close();
    }
  }, [isOpen]);

  const deleteAction = useMemo(() => <DeleteAction categoryId={category.id.value} />, [category.id]);
  const handlePress = useCallback(() => {
    onPress(category.id.value);
  }, []);

  return (
    <Swipeable
      ref={swipeableRef}
      leftThreshold={-theme.component.list.row.height.default}
      rightThreshold={0}
      righActions={deleteAction}
      onPress={handlePress}
      onOpen={() => {
        store.toggleRowCollapseState(category.id.value);
      }}
      onClose={() => {
        store.rowCollapseStates.set(category.id.value, false);
      }}
    >
      <View style={styles.container}>
        <View style={styles.categoryWrap}>
          <CategoryIcon
            iconName={category.iconName}
            iconColor={category.iconColor}
            size={theme.component.list.row.iconSize.middle}
          />
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        <View style={styles.budgetPlanWrap}>
          {label !== undefined && <Text style={styles.budgetPlanLabel}>{label}</Text>}
          {value !== undefined && <Text style={styles.budgetPlanValue}>{value}</Text>}
        </View>
      </View>
    </Swipeable>
  );
}

export default React.memo(Row, (prev, next) => {
  return (
    JSON.stringify(prev.budgetingCategory) === JSON.stringify(next.budgetingCategory) && prev.onPress === next.onPress
  );
});

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: theme.component.list.row.height.default,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.x4,
  },
  categoryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.x2,
  },
  categoryName: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
  budgetPlanWrap: {
    alignItems: 'flex-end',
    gap: theme.spacing.x1,
  },
  budgetPlanLabel: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.tertiary,
  },
  budgetPlanValue: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.primary,
  },
}));
