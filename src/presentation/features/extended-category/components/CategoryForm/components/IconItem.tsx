import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { subscribe, useSnapshot } from 'valtio';

import { RootStackNavigationProp } from '@/src/presentation/navigation/root';

import { ICON_WRAPPER_HEIGHT } from '../constants';
import { useStoreContext } from '../context/StoreContext';

function IconItem() {
  const { styles } = useStyles(stylesheet);

  const { formDataStore } = useStoreContext();
  const { iconName, iconColor } = useSnapshot(formDataStore.form);
  const navigation = useNavigation<RootStackNavigationProp>();

  const handlePress = () => {
    selectedIconGlobalStore.selected.iconName = iconName;
    selectedIconGlobalStore.selected.iconColor = iconColor;
    navigation.navigate('CategoryIconSelector');
  };

  useEffect(() => {
    const unsubscribe = subscribe(selectedIconGlobalStore.selected, () => {
      formDataStore.form.iconName = selectedIconGlobalStore.selected.iconName;
      formDataStore.form.iconColor = selectedIconGlobalStore.selected.iconColor;
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
    backgroundColor: theme.colors.background.layer1,
    borderRadius: theme.radius.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
