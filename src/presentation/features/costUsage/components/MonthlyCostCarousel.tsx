import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useSuspenseQuery } from '@tanstack/react-query';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { withSuspense } from '@/src/presentation/components/hoc/withSuspense';
import { queryOptions } from '@/src/presentation/usecase/query/today/query-options';
import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';

import MonthlyCostOverview from './MonthlyCostOverview';

const indexes = Array.from({ length: 2000 }, (_, i) => i);
const initialIndex = 1000;

function MonthlyCostCaoursel() {
  const todayQuery = useSuspenseQuery(queryOptions.today());
  const initialYearmonth = useRef<Yearmonth>(Yearmonth.build(todayQuery.data.date.year, todayQuery.data.date.month));

  const renderItem = useCallback((item: ListRenderItemInfo<number>) => {
    return <CaroucelBody index={item.index} initialYearmonth={initialYearmonth.current} />;
  }, []);
  const keyExtractor = useCallback((item: number) => item.toString(), []);

  return (
    <View style={styles.container}>
      <FlashList
        pagingEnabled
        data={indexes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={1000}
        estimatedItemSize={DEVICE_LAYOUT.width}
      />
    </View>
  );
}
export default React.memo(withSuspense(MonthlyCostCaoursel));

type CaroucelBodyProps = {
  index: number;
  initialYearmonth: Yearmonth;
};
const CaroucelBody = React.memo(({ index, initialYearmonth }: CaroucelBodyProps) => {
  const ym = initialYearmonth.addMonths(index - initialIndex);
  return (
    <View style={styles.body}>
      <MonthlyCostOverview yearmonth={ym} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: DEVICE_LAYOUT.width,
    height: '100%',
  },
});
