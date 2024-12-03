import { useMemo, useRef } from 'react';
import { Text, Pressable, TextInput } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { numberFormat } from '@/src/presentation/i18n/format';

import { useStoreContext } from '../../../../context/StoreContext';

import { sharedStylesheet } from './styles';

const itemName = 'strategy/regularly/tempAmount';
function TempMoneyRow() {
  const textRef = useRef<TextInput>(null);

  const { formStore, selectedItemStore } = useStoreContext();
  const data = useSnapshot(formStore.form.budgetPlan.strategyInputs.regularly);
  const selectedItem = useSnapshot(selectedItemStore).selected;

  const { styles } = useStyles(stylesheet, {
    isSelected: selectedItem === itemName,
  });

  const tempAmountIsUndefined = data.tempAmount === undefined;

  const label = useMemo(() => {
    switch (data.cycle) {
      case 'yearly':
        return '今年のみ';
      case 'monthly':
        return '今月のみ';
      case 'weekly':
        return '今週のみ';
      default:
        return '';
    }
  }, [data.cycle]);

  const value = useMemo(() => {
    return tempAmountIsUndefined ? '' : numberFormat(data.tempAmount!);
  }, [data.tempAmount]);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        selectedItemStore.selected = itemName;
        textRef.current?.focus();
      }}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <TextInput
        ref={textRef}
        style={styles.textInput}
        value={String(data.tempAmount)}
        keyboardType="number-pad"
        onChangeText={(text) => {
          const num = Number(text);
          if (Number.isNaN(num)) return;

          formStore.form.budgetPlan.strategyInputs.regularly.tempAmount = num;
        }}
      />
    </Pressable>
  );
}
export default TempMoneyRow;
const stylesheet = createStyleSheet((theme) => ({
  ...sharedStylesheet(theme),
  textInput: {
    display: 'none',
  },
}));
