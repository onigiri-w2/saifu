import { useMemo } from 'react';
import { View, Text } from 'react-native';

import { useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import LayoutGridSvg from '@/assets/icons/lucide/layout-grid_1.75px.svg';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

import { useCategoryListContext } from '../context/CategoryListContext';
import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

import CategoryMenuView from './CategoryMenuView';

export default function CategoryRow() {
  const { styles, theme } = useStyles(commonStylesheet);

  const categories = useCategoryListContext();
  const store = useFormStoreContext();
  const categoryId = useSnapshot(store.form).categoryId;

  const category = useMemo(() => {
    return categories.find((category) => category.id === categoryId);
  }, [categoryId, categories]);

  return (
    <View style={styles.container}>
      <LayoutGridSvg
        width={theme.fontSize.subHeading}
        height={theme.fontSize.subHeading}
        stroke={theme.colors.text.primary}
      />
      <Text style={styles.label}>カテゴリ</Text>
      <CategoryMenuView>
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
      </CategoryMenuView>
    </View>
  );
}
