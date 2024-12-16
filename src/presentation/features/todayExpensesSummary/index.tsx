import { Text, View } from 'react-native';

import { useSuspenseQueries } from '@tanstack/react-query';

import { queryOptions } from '../../usecase/query';

function TodayExpensesSummary() {
  const [categoryQuery] = useSuspenseQueries({
    queries: [queryOptions.category.list()],
  });

  return (
    <View>
      <Text>aaaaaaa</Text>
    </View>
  );
}
export default TodayExpensesSummary;
