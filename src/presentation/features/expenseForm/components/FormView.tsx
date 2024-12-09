import { useCallback } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useKeyboardOffsetContext } from '@/src/presentation/components/KeyboardAwareLayout';
import KeyboardSimpleBar from '@/src/presentation/components/KeyboardSimpleBar';

import AmountRow from './AmountRow';
import CategoryRow from './CategoryRow';
import DateRow from './DateRow';
import MemoRow from './MemoRow';
import Saver from './Saver';

export default function FormView() {
  const { styles, theme } = useStyles(stylesheet);
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
          <AmountRow />
          <DateRow />
          <CategoryRow />
          <MemoRow />
          <View style={styles.saveWrapper}>
            <Saver />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardSimpleBar offset={offset} onPressDone={handlePressDone} />
    </>
  );
}
const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingTop: theme.spacing.x5,
    gap: theme.spacing.x5,
  },
  saveWrapper: {
    marginTop: theme.spacing.x2,
    marginHorizontal: theme.spacing.x4,
  },
}));
