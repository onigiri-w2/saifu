import { createStyleSheet } from 'react-native-unistyles';

export const utilStyleSheet = createStyleSheet((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.ground,
  },
}));
