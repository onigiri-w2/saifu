import { useDeferredValue } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';

import ListView from './components/ListView';
import { CategoryContext } from './context/CategoryContext';
import { InfoVariantContext } from './context/InfoVariantContext';
import { InfoVarinat } from './types';

type Props = {
  useDeferredRendering: boolean;
  variant?: InfoVarinat;
};
function BudgetMonitorList({ useDeferredRendering, variant = 'entirly' }: Props) {
  const [metricsQuery, categoryQuery] = useSuspenseQueries({
    queries: [queryOptions.budgetMetrics['active/list'](), queryOptions.category.list()],
  });
  const deferredMetrics = useDeferredValue(metricsQuery.data);
  const deferredCategory = useDeferredValue(categoryQuery.data);

  return (
    <CategoryContext.Provider value={useDeferredRendering ? deferredCategory : categoryQuery.data}>
      <InfoVariantContext.Provider value={variant}>
        <ListView allMetrics={useDeferredRendering ? deferredMetrics : metricsQuery.data} />
      </InfoVariantContext.Provider>
    </CategoryContext.Provider>
  );
}
export default withSuspense(BudgetMonitorList);
