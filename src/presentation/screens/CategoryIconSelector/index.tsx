import { useCallback } from 'react';
import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';

import CategoryIcon from '../../features-shared/categoryIcon';
import CategoryIconGird from '../../features-shared/categoryIconGrid';
import { selectedIconGlobalStore } from '../../store/selectedIcon.store';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const { styles } = useStyles(stylesheet);
  const { selected } = useSnapshot(selectedIconGlobalStore);

  const handleSelect = useCallback((iconName: IconName, iconColor: IconColor) => {
    selectedIconGlobalStore.selected.iconName = iconName;
    selectedIconGlobalStore.selected.iconColor = iconColor;
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <CategoryIcon iconName={selected.iconName} iconColor={selected.iconColor} size={ICON_SIZE} />
      </View>
      <CategoryIconGird initialSelected={selected} onSelect={handleSelect} />
    </View>
  );
}

const ICON_SIZE = 32;
const stylesheet = createStyleSheet((theme) => ({
  ...utilStyleSheet(theme),
  header: {
    height: theme.component.navigation.header.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
