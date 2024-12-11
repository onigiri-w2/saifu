import { createStyleSheet } from 'react-native-unistyles';

import { ROW_HEIGHT } from '../../constants';

export const sharedStylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: ROW_HEIGHT,
    paddingHorizontal: theme.spacing.x4,
  },
  label: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.secondary,
    height: ROW_HEIGHT,
    lineHeight: ROW_HEIGHT,
  },
  value: {
    fontSize: theme.fontSize.body,
    lineHeight: ROW_HEIGHT,
    marginLeft: 'auto',
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
