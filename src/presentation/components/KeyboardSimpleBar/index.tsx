import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { KeyboardAvoidingView, KeyboardController } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  offset: number;
  onPressDone?: () => void;
};
function KeyboardSimpleBar({ offset, onPressDone }: Props) {
  const { styles } = useStyles(stylesheet);

  const handlePressDone = () => {
    KeyboardController.dismiss();
    onPressDone?.();
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={offset} style={styles.container} behavior="position">
      <View style={styles.content}>
        <TouchableOpacity style={styles.doneButton} onPress={handlePressDone}>
          <Text style={styles.doneText}>完了</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
export default React.memo(KeyboardSimpleBar);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    height: 40,
    position: 'absolute',
    bottom: -40,
    left: 0,
  },
  content: {
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.layer2,
    borderTopWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  doneButton: {
    marginLeft: 'auto',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.brand.primary,
    fontWeight: 'bold',
  },
}));
