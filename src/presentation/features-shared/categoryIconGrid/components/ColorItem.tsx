import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CheckSvg from '@/assets/icons/lucide/check_3px.svg';
import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';

import { COLMUN_COUNT } from '../cosntants';

type Props = {
  color: IconColor;
  isSelected: boolean;
  onSelect: (color: IconColor) => void;
};
function ColorItem({ color, isSelected, onSelect }: Props) {
  const { styles, theme } = useStyles(stylesheet, { isSelected });

  return (
    <View key={color} style={styles.itemWrapper}>
      <Pressable
        style={[styles.item, { backgroundColor: color }]}
        onPress={() => {
          onSelect(color);
        }}
      />
      {isSelected && (
        <View style={[styles.checkWrapper, StyleSheet.absoluteFill]}>
          <CheckSvg width={CHECK_ICON_SIZE} height={CHECK_ICON_SIZE} stroke={theme.colors.brand.primary} />
        </View>
      )}
    </View>
  );
}

export default React.memo(ColorItem);

const CHECK_ICON_SIZE = 28;
const stylesheet = createStyleSheet((theme) => ({
  itemWrapper: {
    width: `${100 / (COLMUN_COUNT + 1)}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  item: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
    variants: {
      isSelected: {
        true: {
          opacity: 0.3,
        },
      },
    },
  },
  checkWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.brand.primary,
  },
}));
