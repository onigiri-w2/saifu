import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useIsFocused, useNavigation } from '@react-navigation/native';

import CategoryList from '../../features/categoryList';
import { RootStackNavigationProp } from '../../navigation/root';

export default function Page() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<RootStackNavigationProp>();

  const handlePressAdd = useCallback(() => {
    navigation.navigate('CategoryDetail', { categoryId: undefined });
  }, []);
  const handpePressItem = useCallback((categoryId: string) => {
    navigation.navigate('CategoryDetail', { categoryId });
  }, []);

  return (
    <View style={styles.container}>
      <CategoryList onPressAdd={handlePressAdd} onPressItem={handpePressItem} useDeferredRender={isFocused} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
