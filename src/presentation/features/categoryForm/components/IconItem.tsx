import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { subscribe, useSnapshot } from 'valtio';

import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';
import { RootStackNavigationProp } from '@/src/presentation/navigation/root';
import { selectedIconGlobalStore } from '@/src/presentation/store/selectedIcon.store';

import { ICON_WRAPPER_HEIGHT } from '../constants';
import { useStoreContext } from '../context/StoreContext';

function IconItem() {
  const { styles } = useStyles(stylesheet);

  const { formStore } = useStoreContext();
  const { iconName, iconColor } = useSnapshot(formStore.form);
  const navigation = useNavigation<RootStackNavigationProp>();

  const handlePress = () => {
    selectedIconGlobalStore.selected.iconName = iconName;
    selectedIconGlobalStore.selected.iconColor = iconColor;
    navigation.navigate('CategoryIconSelector');
  };

  useEffect(() => {
    const unsubscribe = subscribe(selectedIconGlobalStore.selected, () => {
      formStore.form.iconName = selectedIconGlobalStore.selected.iconName;
      formStore.form.iconColor = selectedIconGlobalStore.selected.iconColor;
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <CategoryIcon iconName={iconName} iconColor={iconColor} size={24} />
    </TouchableOpacity>
  );
}
export default React.memo(IconItem);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    height: ICON_WRAPPER_HEIGHT,
    width: ICON_WRAPPER_HEIGHT,
    backgroundColor: theme.colors.background.layer2,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
