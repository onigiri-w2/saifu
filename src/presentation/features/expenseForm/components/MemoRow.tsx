import React from 'react';
import { View, Text, TextInput } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import NoteSvg from '@/assets/icons/lucide/notepad.svg';

import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

function MemoRow() {
  const { styles, theme } = useStyles(stylesheet);
  const formStore = useFormStoreContext();
  const memo = useSnapshot(formStore.form).memo;
  const handleCahngeText = (text: string) => {
    formStore.form.memo = text;
  };

  return (
    <View style={styles.container}>
      <NoteSvg
        width={theme.fontSize.subHeading}
        height={theme.fontSize.subHeading}
        stroke={theme.colors.text.primary}
      />
      <Text style={styles.label}>メモ</Text>
      <TextInput
        value={memo}
        style={styles.textinput}
        onChangeText={handleCahngeText}
        placeholder="メモを入力"
        multiline={false}
      />
    </View>
  );
}

export default React.memo(MemoRow);

const stylesheet = createStyleSheet((theme) => ({
  ...commonStylesheet(theme),
  textinput: {
    flex: 1,
    marginLeft: theme.spacing.x2,
    fontSize: theme.fontSize.body,
    textAlign: 'right',
    alignItems: 'center',
  },
}));
