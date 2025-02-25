import { createStyleSheet } from 'react-native-unistyles';

export const rowBodyStyleSheet = createStyleSheet((theme) => ({
  valueTextWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mainValueWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.x1,
  },
  mainValuePrefix: {
    fontSize: theme.fontSize.subCaption,
    color: theme.colors.text.secondary,
    transform: [{ translateY: -1 }],
  },
  mainValue: {
    fontSize: theme.fontSize.subBody,
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
