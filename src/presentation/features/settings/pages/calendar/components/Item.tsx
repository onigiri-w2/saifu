import React from 'react';
import { Pressable, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props<T> = {
  value: T;
  label?: string;
  isActive?: boolean;
  onPress?: (value: T) => void;
};
function BaseItem<T>({ value, label, isActive = false, onPress }: Props<T>) {
  const { styles } = useStyles(stylesheet, { isActive });
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onPress?.(value);
      }}
    >
      <Text style={styles.text}>{label ?? String(value)}</Text>
    </Pressable>
  );
}
export default React.memo(BaseItem) as typeof BaseItem;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '100%',
    height: theme.component.list.row.height.default,
    paddingHorizontal: theme.spacing.x4,
    justifyContent: 'center',
    borderRadius: theme.radius.default,
    variants: {
      isActive: {
        true: {
          backgroundColor: theme.colors.brand.primaryTint,
          borderWidth: 1,
          borderColor: theme.colors.brand.primary,
        },
        false: {
          backgroundColor: theme.colors.background.layer1,
        },
      },
    },
  },
  text: {
    fontSize: theme.fontSize.subHeading,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
}));
