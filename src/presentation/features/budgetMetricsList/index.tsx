import { useDeferredValue } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';

import ListView from './components/ListView';
import { CategoryContext } from './context/CategoryContext';

type Props = {
  useDeferredRendering: boolean;
};
function BudgetMonitorList({ useDeferredRendering }: Props) {
  const [metricsQuery, categoryQuery] = useSuspenseQueries({
    queries: [queryOptions.budgetMetrics['active/list'](), queryOptions.category.list()],
  });
  const deferredMetrics = useDeferredValue(metricsQuery.data);
  const deferredCategory = useDeferredValue(categoryQuery.data);

  return (
    <CategoryContext.Provider value={useDeferredRendering ? deferredCategory : categoryQuery.data}>
      <ListView allMetrics={useDeferredRendering ? deferredMetrics : metricsQuery.data} />
    </CategoryContext.Provider>
  );
}
export default withSuspense(BudgetMonitorList);
