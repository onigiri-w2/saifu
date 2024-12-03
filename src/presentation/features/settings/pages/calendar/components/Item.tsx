import React from 'react';
import { Pressable, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  value: string;
  label?: string;
  isActive?: boolean;
  onPress?: (value: string) => void;
};
function Item({ value, label, isActive = false, onPress }: Props) {
  const { styles } = useStyles(stylesheet, { isActive });

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onPress?.(value);
      }}
    >
      <Text style={styles.text}>{label ?? value}</Text>
    </Pressable>
  );
}
export default React.memo(Item);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    height: 52,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    variants: {
      isActive: {
        true: {
          backgroundColor: theme.colors.brand.primaryTint,
          borderWidth: 1,
          borderColor: theme.colors.brand.primary,
        },
        false: {
          backgroundColor: theme.colors.background.layer2,
        },
      },
    },
  },
  text: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
}));
