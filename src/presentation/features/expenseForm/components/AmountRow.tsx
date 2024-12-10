import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, Text, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import DollersSvg from '@/assets/icons/lucide/dollers_1.75px.svg';
import { numberFormat } from '@/src/presentation/i18n/format';

import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

type Props = {
  initialAutoFocus?: boolean;
};
function AmountRow({ initialAutoFocus = false }: Props) {
  const store = useFormStoreContext();
  const value = useSnapshot(store.form).amount;

  const [isFocused, setIsFocused] = useState(false);

  const { styles, theme } = useStyles(stylesheet, { isFocused });
  const [textValue, setTextValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initialAutoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, []);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <DollersSvg
        width={theme.fontSize.subHeading}
        height={theme.fontSize.subHeading}
        stroke={theme.colors.text.primary}
      />
      <Text style={styles.label}>金額</Text>
      <View style={styles.textView}>
        <Text style={styles.text}>{numberFormat(value)}</Text>
        <TextInput
          ref={inputRef}
          key="expenseform/amount"
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
      </View>
    </Pressable>
  );
}

export default React.memo(AmountRow);

const stylesheet = createStyleSheet((theme) => ({
  ...commonStylesheet(theme),
  textinput: {
    fontSize: theme.fontSize.body,
    display: 'none',
  },
  textView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
    variants: {
      isFocused: {
        true: {
          color: theme.colors.brand.primary,
        },
        false: {
          color: theme.colors.text.primary,
        },
      },
    },
  },
}));
