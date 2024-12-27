import { useDeferredValue, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';

import ListView from './components/ListView';
import { CategoryToggleMapStoreContext } from './context';
import { CategoryToggleMapStore, createCategoryToggleMapStore } from './store';

type Props = {
  onPressAdd: () => void;
  onPressItem: (categoryId: string) => void;
  useDeferredRender?: boolean;
};
function CategoryList({ onPressAdd, onPressItem, useDeferredRender = true }: Props) {
  const categoryListQuery = useSuspenseQuery(queryOptions.category.list());
  const viewData = categoryListQuery.data;
  const deferredViewData = useDeferredValue(viewData);

  const store = useRef<CategoryToggleMapStore>();
  if (!store.current) {
    store.current = createCategoryToggleMapStore(categoryListQuery.data.map((c) => c.category.id.value));
  }

  return (
    <CategoryToggleMapStoreContext.Provider value={store.current}>
      <ListView
        viewData={useDeferredRender ? deferredViewData : viewData}
        onPressAdd={onPressAdd}
        onPressItem={onPressItem}
      />
    </CategoryToggleMapStoreContext.Provider>
  );
}
export default withSuspense(CategoryList);
