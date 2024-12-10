import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import NoteSvg from '@/assets/icons/lucide/notepad.svg';

import { commonStylesheet } from '../style';

function MemoRow() {
  const { styles, theme } = useStyles(stylesheet);
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <NoteSvg width={theme.fontSize.subHeading} height={theme.fontSize.subHeading} stroke="#000" />
      <Text style={styles.label}>メモ</Text>
      <TextInput
        value={value}
        style={styles.textinput}
        onChangeText={setValue}
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
