import { useDeferredValue } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query/budgeting-category/query-options';

import ListView from './components/ListView';
import { StoreProvider } from './context';

type Props = {
  onPressAdd: () => void;
  onPressItem: (categoryId: string) => void;
  useDeferredRender?: boolean;
};
function CategoryList({ onPressAdd, onPressItem, useDeferredRender = true }: Props) {
  const query = useSuspenseQuery(queryOptions.list());
  const viewData = query.data;
  const deferredViewData = useDeferredValue(viewData);

  return (
    <StoreProvider categoryIds={query.data.map((c) => c.category.id)}>
      <ListView
        viewData={useDeferredRender ? deferredViewData : viewData}
        onPressAdd={onPressAdd}
        onPressItem={onPressItem}
      />
    </StoreProvider>
  );
}
export default withSuspense(CategoryList);
