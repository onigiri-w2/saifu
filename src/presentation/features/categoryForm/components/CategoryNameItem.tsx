import React, { useCallback } from 'react';
import { TextInput } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { ICON_WRAPPER_HEIGHT } from '../constants';
import { useStoreContext } from '../context/StoreContext';

function CategoryNameItem() {
  const { styles, theme } = useStyles(stylesheet);
  const { formDataStore, formFocusStore } = useStoreContext();
  const categoryName = useSnapshot(formDataStore.form).categoryName;

  const handleChangeText = useCallback((text: string) => {
    formDataStore.form.categoryName = text;
  }, []);
  const handleFocus = useCallback(() => {
    formFocusStore.focused = undefined;
  }, []);

  return (
    <TextInput
      style={styles.container}
      value={categoryName}
      onChangeText={handleChangeText}
      inputAccessoryViewID="categoryName"
      returnKeyType="done"
      placeholder="名前を入力"
      placeholderTextColor={theme.colors.text.placeholder}
      onFocus={handleFocus}
    />
  );
}
export default React.memo(CategoryNameItem);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    height: ICON_WRAPPER_HEIGHT,
    backgroundColor: theme.colors.background.layer2,
    borderRadius: theme.radius.default,
    fontSize: theme.fontSize.body,
    padding: theme.spacing.x3,
  },
}));
