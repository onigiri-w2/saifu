import { useCallback } from 'react';
import { View } from 'react-native';

import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import CategoryList from '../../features/categoryList';
import { RootStackNavigationProp } from '../../navigation/root';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { styles } = useStyles(utilStyleSheet);

  const handlePressAdd = useCallback(() => {
    navigation.dispatch(StackActions.push('CategoryDetail', { categoryId: undefined }));
  }, []);

  const handlePressItem = useCallback((categoryId: string) => {
    navigation.dispatch(StackActions.push('CategoryDetail', { categoryId, timestamp: Date.now().toString() }));
  }, []);

  return (
    <View style={styles.screen}>
      <CategoryList onPressAdd={handlePressAdd} onPressItem={handlePressItem} useDeferredRender={isFocused} />
    </View>
  );
}
