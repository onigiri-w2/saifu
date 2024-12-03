import { createStyleSheet } from 'react-native-unistyles';

import { ROW_HEIGHT } from '../../constants';

export const sharedStylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ROW_HEIGHT,
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: theme.fontSize.md,
    variants: {
      isSelected: {
        true: {
          color: theme.colors.brand.primary,
        },
        false: {
          color: theme.colors.text.primary,
        },
      },
    },
  },
}));
