import { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { useKeyboardOffsetContext } from '@/src/presentation/components/KeyboardAwareLayout';
import KeyboardSimpleBar from '@/src/presentation/components/KeyboardSimpleBar';

import { useStoreContext } from '../context/StoreContext';

import BudgetContent from './BudgetContent';
import CategoryNameItem from './CategoryNameItem';
import IconItem from './IconItem';

export default function FormView() {
  const { styles, theme } = useStyles(stylesheet);
  const offset = useKeyboardOffsetContext();

  const { formFocusStore } = useStoreContext();

  const onPressDone = useCallback(() => {
    formFocusStore.focused = undefined;
  }, []);

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={offset + 40}>
        <ScrollView
          style={styles.container}
          contentInset={{ bottom: theme.spacing['x12'] }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.upperArea}>
            <IconItem />
            <CategoryNameItem />
          </View>
          <View style={styles.budgetArea}>
            <BudgetContent />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardSimpleBar offset={offset} onPressDone={onPressDone} />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing.x6,
  },
  upperArea: {
    flexDirection: 'row',
    gap: theme.spacing.x2,
  },
  budgetArea: {
    marginTop: theme.spacing.x7,
  },
  toolbar: {
    width: '100%',
    height: 44,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  toolbarContent: {
    backgroundColor: 'red',
    height: '100%',
  },
}));
