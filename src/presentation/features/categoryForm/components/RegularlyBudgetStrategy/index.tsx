import React from 'react';
import { View, ViewStyle } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { useStoreContext } from '../../context/StoreContext';

import AnimatedRow from './components/AniamtedRow';
import CycleRow from './components/rows/CycleRow';
import MoneyRow from './components/rows/MoneyRow';
import TempMoneyRow from './components/rows/TempMoneyRow';
import ToggleTempMoney from './components/ToggleTempMoney';

type Props = {
  style: ViewStyle;
};
function RegularlyBudgetStrategy({ style }: Props) {
  const { styles } = useStyles(stylesheet);
  const { formStore } = useStoreContext();
  const isActiveTempAmount = useSnapshot(formStore.form.budgetPlan.strategyInputs.regularly).tempAmount !== undefined;

  return (
    <View style={style}>
      <View style={styles.itemContainer}>
        <MoneyRow />
        {isActiveTempAmount && <View style={styles.separator} />}
        <AnimatedRow isActive={isActiveTempAmount}>
          <TempMoneyRow />
        </AnimatedRow>
        <View style={styles.separator} />
        <CycleRow />
      </View>
      <View style={styles.toggleContainer}>
        <ToggleTempMoney isActive={isActiveTempAmount} />
      </View>
    </View>
  );
}
export default RegularlyBudgetStrategy;

const stylesheet = createStyleSheet((theme) => ({
  itemContainer: {
    backgroundColor: theme.colors.background.layer2,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.secondary,
  },
  toggleContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.lg,
  },
}));
