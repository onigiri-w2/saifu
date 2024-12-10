import { useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';

import { NativeActionEvent, MenuView } from '@react-native-menu/menu';
import { useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import LayoutGridSvg from '@/assets/icons/lucide/layout-grid_1.75px.svg';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

import { useCategoryListContext } from '../context/CategoryListContext';
import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

export default function CategoryRow() {
  const { styles, theme } = useStyles(commonStylesheet);

  const categories = useCategoryListContext();
  const store = useFormStoreContext();
  const categoryId = useSnapshot(store.form).categoryId;

  const category = useMemo(() => {
    return categories.find((category) => category.id === categoryId);
  }, [categoryId, categories]);

  const menuRef = useRef(null);

  const actions = useMemo(() => {
    return categories.map((category) => {
      return {
        id: category.id,
        title: category.name,
        state: categoryId === category.id ? ('on' as const) : ('off' as const),
      };
    });
  }, [categories, categoryId]);

  const handlePressActions = useCallback(({ nativeEvent }: NativeActionEvent) => {
    setTimeout(() => {
      store.form.categoryId = nativeEvent.event;
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <LayoutGridSvg
        width={theme.fontSize.subHeading}
        height={theme.fontSize.subHeading}
        stroke={theme.colors.text.primary}
      />
      <Text style={styles.label}>カテゴリ</Text>
      <MenuView
        ref={menuRef}
        title=""
        onPressAction={handlePressActions}
        style={styles.valueWrapper}
        actions={actions}
        shouldOpenOnLongPress={false}
      >
        {category ? (
          <>
            <CategoryIcon
              iconName={category.iconName}
              iconColor={category.iconColor}
              size={theme.fontSize.subHeading}
            />
            <Text style={styles.value}>{category.name}</Text>
          </>
        ) : (
          <Text style={styles.value}>カテゴリがありません</Text>
        )}
      </MenuView>
    </View>
  );
}
