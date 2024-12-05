import { useCallback } from 'react';
import { View } from 'react-native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import CategoryList from '../../features/categoryList';
import { RootStackNavigationProp } from '../../navigation/root';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { styles } = useStyles(utilStyleSheet);

  const handlePressAdd = useCallback(() => {
    navigation.navigate('CategoryDetail', { categoryId: undefined });
  }, []);
  const handpePressItem = useCallback((categoryId: string) => {
    navigation.navigate('CategoryDetail', { categoryId });
  }, []);

  return (
    <View style={styles.screen}>
      <CategoryList onPressAdd={handlePressAdd} onPressItem={handpePressItem} useDeferredRender={isFocused} />
    </View>
  );
}
