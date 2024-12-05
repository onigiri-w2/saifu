import { createStyleSheet } from 'react-native-unistyles';

export const utilStyleSheet = createStyleSheet((theme) => ({
  pageContainer: {
    flex: 1,
    padding: theme.spacing.x3,
  },
}));
