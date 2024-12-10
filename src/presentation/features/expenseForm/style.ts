import { createStyleSheet } from 'react-native-unistyles';

export const commonStylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.x4,
    height: 48,
  },
  label: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.x2,
  },
  valueWrapper: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.x1,
  },
  value: {
    fontSize: theme.fontSize.body,
  },
}));
