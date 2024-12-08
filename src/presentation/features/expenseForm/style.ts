import { createStyleSheet } from 'react-native-unistyles';

export const commonStylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.x4,
    height: 32,
  },
  label: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.x2,
  },
  valueWrapper: {
    height: '100%',
    paddingHorizontal: theme.spacing.x3,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background.layer2,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.x2,
  },
  value: {
    fontSize: theme.fontSize.body,
  },
}));
