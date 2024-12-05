import React from 'react';
import { View, ViewStyle } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { useStoreContext } from '../../context/StoreContext';

import AnimatedRow from './components/AniamtedRow';
import CycleItem from './components/items/CycleItem';
import MoneyItem from './components/items/MoneyItem';
import TempMoneyItem from './components/items/TempMoneyItem';
import ToggleTempMoney from './components/ToggleTempMoney';

type Props = {
  style: ViewStyle;
};
function RegularlyBudgetStrategy({ style }: Props) {
  const { styles } = useStyles(stylesheet);
  const { formDataStore } = useStoreContext();
  const isActiveTempAmount =
    useSnapshot(formDataStore.form.budgetPlan.strategyInputs.regularly).tempAmount !== undefined;

  return (
    <View style={style}>
      <View style={styles.itemContainer}>
        <MoneyItem />
        {isActiveTempAmount && <View style={styles.separator} />}
        <AnimatedRow isActive={isActiveTempAmount}>
          <TempMoneyItem />
        </AnimatedRow>
        <View style={styles.separator} />
        <CycleItem />
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
    borderRadius: theme.radius.default,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.secondary,
  },
  toggleContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.x3,
  },
}));
