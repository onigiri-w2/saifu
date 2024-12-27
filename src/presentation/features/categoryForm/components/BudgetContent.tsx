import React from 'react';
import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { useStoreContext } from '../context/StoreContext';

import NoBudgetStrategy from './NoBudgetStrategy';
import RegularlyBudgetStrategy from './RegularlyBudgetStrategy';
import StrategySwitcher from './StrategySwitcher';

function BudgetContent() {
  const { styles } = useStyles(stylesheet);

  const { formDataStore } = useStoreContext();
  const selectedStrategy = useSnapshot(formDataStore.form.budgetPlan).selectedStrategyType;

  return (
    <View>
      <Text style={styles.budgetAreaTitle}>予算設定</Text>
      <Text style={styles.budgetAreaSubTitle}>予算管理方法を選択してください</Text>
      <StrategySwitcher />
      <View style={styles.budgetContent}>
        <NoBudgetStrategy style={styles.showContent(selectedStrategy === 'none')} />
        <RegularlyBudgetStrategy style={styles.showContent(selectedStrategy === 'regularly')} />
      </View>
    </View>
  );
}
export default React.memo(BudgetContent);

const stylesheet = createStyleSheet((theme) => ({
  budgetAreaTitle: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xhalf,
  },
  budgetAreaSubTitle: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.x3,
  },
  budgetContent: {
    marginTop: theme.spacing.x3,
  },
  showContent: (show: boolean) => ({
    display: show ? 'flex' : 'none',
  }),
}));
