import { useRef } from 'react';
import { Text, Pressable, TextInput } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { numberFormat } from '@/src/presentation/i18n/format';

import { useStoreContext } from '../../../../context/StoreContext';

import { sharedStylesheet } from './styles';

const itemName = 'strategy/regularly/amount';
function MoneyRow() {
  const textRef = useRef<TextInput>(null);

  const { formDataStore, formFocusStore } = useStoreContext();
  const data = useSnapshot(formDataStore.form.budgetPlan.strategyInputs.regularly);
  const selectedItem = useSnapshot(formFocusStore).focused;

  const { styles } = useStyles(stylesheet, {
    isSelected: selectedItem === itemName,
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        formFocusStore.focused = itemName;
        textRef.current?.focus();
      }}
    >
      <Text style={styles.label}>予算額</Text>
      <Text style={styles.value}>{numberFormat(data.amount)}</Text>
      <TextInput
        key="amount"
        ref={textRef}
        value={String(data.amount)}
        style={styles.textInput}
        keyboardType="number-pad"
        onChangeText={(text) => {
          const num = Number(text);
          if (Number.isNaN(num)) return;

          formDataStore.form.budgetPlan.strategyInputs.regularly.amount = num;
        }}
      />
    </Pressable>
  );
}
export default MoneyRow;

const stylesheet = createStyleSheet((theme) => ({
  ...sharedStylesheet(theme),
  textInput: {
    display: 'none',
  },
}));
