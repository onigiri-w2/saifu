import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';

import MonthlyOverview from './MonthlyOverview';

const POSITIONs = Array.from({ length: 2000 }, (_, i) => i);
const CENTER_POSITION = 1000;

type Props = {
  initialYearmonth: Yearmonth;
};
export default function MonthlyCarousel({ initialYearmonth }: Props) {
  const [currentPosition, setCurrentPosition] = useState(CENTER_POSITION);
  const renderItem = useCallback((item: ListRenderItemInfo<number>) => {
    const position = item.index;
    const yearmonth = initialYearmonth.addMonths(position - CENTER_POSITION);
    return (
      <View style={styles.body}>
        <MonthlyOverview yearmonth={yearmonth} useDeferredRender={Math.abs(position - currentPosition) > 1} />
      </View>
    );
  }, []);
  const keyExtractor = useCallback((item: number) => item.toString(), []);

  return (
    <View style={styles.container}>
      <FlashList
        pagingEnabled
        data={POSITIONs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={CENTER_POSITION}
        estimatedItemSize={DEVICE_LAYOUT.width}
        onMomentumScrollEnd={(event) => {
          const position = Math.round(event.nativeEvent.contentOffset.x / DEVICE_LAYOUT.width);
          setCurrentPosition(position);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: DEVICE_LAYOUT.width,
    height: '100%',
  },
});
