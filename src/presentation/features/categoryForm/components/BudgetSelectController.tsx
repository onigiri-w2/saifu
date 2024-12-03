import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { SvgProps } from 'react-native-svg';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import SlashCycleSvg from '@/assets/icons/lucide/circle-slash_1.75px.svg';
import CycleSvg from '@/assets/icons/lucide/cycle.svg';
import { StrategyType } from '@/src/domain/aggregation/budgetPlan/types';

import { useStoreContext } from '../context/StoreContext';

function BudgetSelectController() {
  const { styles, theme } = useStyles(stylesheet);
  const { formStore } = useStoreContext();
  const selectedType = useSnapshot(formStore.form.budgetPlan).selectedStrategyType;

  const handlePress = (value: StrategyType) => {
    formStore.form.budgetPlan.selectedStrategyType = value;
  };

  return (
    <View style={styles.container}>
      {strategyOptions.map((option) => (
        <Pressable
          key={option.value}
          style={styles.button(option.value === selectedType)}
          onPress={() => handlePress(option.value)}
        >
          <option.icon width={ICON_SIZE} height={ICON_SIZE} stroke={theme.colors.text.primary} />
          <Text style={styles.buttonLabel}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
export default React.memo(BudgetSelectController);

type Option = {
  label: string;
  value: StrategyType;
  icon: React.FC<SvgProps>;
};
const strategyOptions: Option[] = [
  { label: '予算なし', value: 'none', icon: SlashCycleSvg },
  { label: '定期予算', value: 'regularly', icon: CycleSvg },
];

const ICON_SIZE = 14;
const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    backgroundColor: theme.colors.background.layer3,
    padding: theme.spacing.xs,
    flexDirection: 'row',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  button: (isActive: boolean) => {
    return {
      flex: 1,
      flexDirection: 'row',
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: isActive ? theme.colors.background.layer1 : theme.colors.background.layer3,
    };
  },
  buttonLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
}));
