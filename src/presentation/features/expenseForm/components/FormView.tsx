import React, { useCallback } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useKeyboardOffsetContext } from '@/src/presentation/components/KeyboardAwareLayout';
import KeyboardSimpleBar from '@/src/presentation/components/KeyboardSimpleBar';

import AmountRow from './AmountRow';
import CategoryRow from './CategoryRow';
import DateRow from './DateRow';
import MemoRow from './MemoRow';
import Saver from './Saver';

type Props = {
  initialAutoFocusAmount?: boolean;
};
function FormView({ initialAutoFocusAmount }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  // Note: こいつによって、マウント直後に3回くらいレンダリングされる。
  const offset = useKeyboardOffsetContext();

  const handlePressDone = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={offset + 40}>
        <ScrollView
          contentContainerStyle={styles.container}
          contentInset={{ bottom: theme.spacing.x12 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formBox}>
            <AmountRow initialAutoFocus={initialAutoFocusAmount} />
            <View style={styles.separater} />
            <DateRow />
            <View style={styles.separater} />
            <CategoryRow />
            <View style={styles.separater} />
            <MemoRow />
          </View>
          <View style={styles.saveWrapper}>
            <Saver />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardSimpleBar offset={offset} onPressDone={handlePressDone} />
    </>
  );
}

export default React.memo(FormView);
const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingTop: theme.spacing.x4,
    gap: theme.spacing.x4,
    paddingHorizontal: theme.spacing.x4,
  },
  saveWrapper: {
    marginTop: theme.spacing.x2,
  },
  formBox: {
    backgroundColor: theme.colors.background.layer1,
    borderRadius: theme.radius.default,
  },
  separater: {
    height: 1,
    backgroundColor: theme.colors.border.listSeparator,
  },
}));
