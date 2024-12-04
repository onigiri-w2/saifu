import { useDeferredValue, useMemo } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';

import { withSuspense } from '../../components/hoc/withSuspense';
import { queryOptions } from '../../usecase/query';
import { BudgetingCategory } from '../../usecase/query/budgeting-category/functions';
import { budgetingCategoryQueryOptions as categoryQueryOptions } from '../../usecase/query/budgeting-category/query-options';
import { MonitorViewData } from '../categoryList/types';

import ListView from './components/ListView';

type Props = {
  useDeferredRendering: boolean;
};
function BudgetMonitorList({ useDeferredRendering }: Props) {
  const [monitorRslt, categoryQRslt] = useSuspenseQueries({
    queries: [queryOptions.budgetMonitor.thisCycleMonitorList(), categoryQueryOptions.list()],
  });
  const viewData = useViewData(monitorRslt.data, categoryQRslt.data);
  const defferedViewData = useDeferredValue(viewData);

  return <ListView viewData={useDeferredRendering ? defferedViewData : viewData} />;
}
export default withSuspense(BudgetMonitorList);

const useViewData = (monitors: ThisCycleMonitor[], categories: BudgetingCategory[]) => {
  return useMemo(() => {
    return monitors
      .map((m) => {
        const category = categories.find((c) => c.category.id === m.categoryId);
        if (!category) return null;
        return { monitor: m, category };
      })
      .filter((v): v is MonitorViewData => v !== null);
  }, [monitors, categories]);
};
