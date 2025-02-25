import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { ExtendedCategory } from '../../types';
import CategoryRow from '../CategoryRow';

import { useExtendedCategories } from './hooks';

type Props = {
  useDeferredRendering: boolean;
};
function CategoryList({ useDeferredRendering }: Props) {
  const extendedCategories = useExtendedCategories(useDeferredRendering);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<ExtendedCategory>) => {
    return <CategoryRow extendedCategory={item} />;
  }, []);
  const keyExtractor = useCallback((item: ExtendedCategory) => item.category.id.value, []);

  return <FlatList data={extendedCategories} renderItem={renderItem} keyExtractor={keyExtractor} />;
}

export default CategoryList;
