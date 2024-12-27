import React from 'react';
import { Pressable, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { IconName } from '@/src/domain/types/categoryIconName';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

type Props = {
  iconName: IconName;
  isSelected: boolean;
  onSelect: (iconName: IconName) => void;
};
function Item({ iconName, isSelected, onSelect }: Props) {
  const { styles } = useStyles(stylesheet, { isSelected });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => {
          onSelect(iconName);
        }}
      >
        <CategoryIcon iconName={iconName} size={ICON_SIZE} iconColor={ICON_COLOR} />
      </Pressable>
    </View>
  );
}
export default React.memo(Item);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    aspectRatio: 1,
    padding: theme.spacing.x3,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.default,
    borderWidth: 1,
    variants: {
      isSelected: {
        true: {
          borderColor: theme.colors.brand.primary,
          backgroundColor: theme.colors.brand.primaryTint,
        },
        false: {
          borderColor: theme.colors.background.layer1,
          backgroundColor: theme.colors.background.layer1,
        },
      },
    },
  },
}));

const ICON_COLOR = '#666666';
const ICON_SIZE = 28;
