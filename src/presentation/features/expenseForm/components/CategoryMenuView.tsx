import { useCallback, useMemo, useRef } from 'react';

import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { useCategoryListContext } from '../context/CategoryListContext';
import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

type Props = {
  children?: React.ReactNode;
};
export default function CategoryMenuView({ children }: Props) {
  const menuRef = useRef(null);
  const { styles } = useStyles(commonStylesheet);
  const categories = useCategoryListContext();

  const store = useFormStoreContext();
  const selectedCategoryId = useSnapshot(store.form).categoryId;

  const actions = useMemo(() => {
    return categories.map((category) => {
      return {
        id: category.id,
        title: category.name,
        state: selectedCategoryId === category.id ? ('on' as const) : ('off' as const),
      };
    });
  }, [categories, selectedCategoryId]);

  const handlePressActions = useCallback(({ nativeEvent }: NativeActionEvent) => {
    setTimeout(() => {
      store.form.categoryId = nativeEvent.event;
    }, 100);
  }, []);

  return (
    <MenuView
      ref={menuRef}
      title=""
      onPressAction={handlePressActions}
      style={styles.valueWrapper}
      actions={actions}
      shouldOpenOnLongPress={false}
    >
      {children}
    </MenuView>
  );
}
