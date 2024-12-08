import { useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { numberFormat } from '@/src/presentation/i18n/format';

import { useFormStoreContext } from '../context/FormStoreContext';

export default function AmountRow() {
  const store = useFormStoreContext();
  const value = useSnapshot(store.form).amount;

  const [isFocused, setIsFocused] = useState(false);

  const { styles } = useStyles(stylesheet, {
    state: isFocused ? 'focused' : value === 0 ? 'isZero' : 'nonZero',
  });
  const [textValue, setTextValue] = useState('');

  const inputRef = useRef<TextInput>(null);

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.text}>{numberFormat(value)}</Text>
      <TextInput
        ref={inputRef}
        key="amount"
        style={styles.textinput}
        value={textValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        onChangeText={(text) => {
          const number = Number(text) || 0;
          setTextValue(number.toString());
          store.form.amount = number;
        }}
      />
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingVertical: theme.spacing.x12,
    width: '100%',
    alignItems: 'center',
  },
  textinput: {
    fontSize: theme.fontSize.body,
    display: 'none',
  },
  text: {
    fontSize: theme.fontSize.title,
    color: theme.colors.text.primary,
    fontWeight: 700,
    variants: {
      state: {
        focused: {
          color: theme.colors.brand.primary,
        },
        isZero: {
          color: theme.colors.text.tertiary,
        },
        nonZero: {
          color: theme.colors.text.primary,
        },
      },
    },
  },
}));
