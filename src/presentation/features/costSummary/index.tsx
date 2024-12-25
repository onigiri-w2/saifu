import { Text } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { queryOptions } from '../../usecase/query';

import { CategoryContext } from './context/CategoryContext';

function CostSummary() {
  const categoryQuery = useQuery(queryOptions.category.list());
  const calendarCurrentQuery = useQuery(queryOptions.calendar.current());
  const timeseriesQuery = useQuery({
    ...queryOptions.projectedCost['monthly/aggregated'](calendarCurrentQuery.data!.yearmonth),
    enabled: calendarCurrentQuery.data?.yearmonth !== undefined,
  });

  if (categoryQuery.isLoading || calendarCurrentQuery.isLoading || timeseriesQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (categoryQuery.isError || calendarCurrentQuery.isError || timeseriesQuery.isError) {
    return <Text>Error...</Text>;
  }

  if (
    categoryQuery.data === undefined ||
    calendarCurrentQuery.data === undefined ||
    timeseriesQuery.data === undefined
  ) {
    return <Text>Invalid data...</Text>;
  }

  return (
    <CategoryContext.Provider value={categoryQuery.data}>
      <Text>aa</Text>
    </CategoryContext.Provider>
  );
}
export default CostSummary;
