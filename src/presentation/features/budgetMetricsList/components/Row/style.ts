import { createStyleSheet } from 'react-native-unistyles';

export const rowBodyStyleSheet = createStyleSheet((theme) => ({
  mainValue: {
    fontSize: theme.fontSize.body,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  subValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.x1,
  },
  subValue: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.primary,
  },
}));
