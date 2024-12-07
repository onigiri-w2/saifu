import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';

import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';

import { useRenderingModeSwitchContext } from '../context/RenderingModeSwitchContext';
import MonthlyOverview from '../MonthlyOverview';

const POSITIONs = Array.from({ length: 2000 }, (_, i) => i);
const CENTER_POSITION = 1000;

type Props = {
  initialYearmonth: Yearmonth;
  onChangeYearmonth?: (yearmonth: Yearmonth) => void;
};

export default function MonthlyCarousel({ initialYearmonth, onChangeYearmonth }: Props) {
  const { switchMode } = useRenderingModeSwitchContext();
  const focusYearmonth = useRef(initialYearmonth);

  const renderItem = useCallback((item: ListRenderItemInfo<number>) => {
    const position = item.index;
    const yearmonth = initialYearmonth.addMonths(position - CENTER_POSITION);
    return (
      <View style={styles.body}>
        <MonthlyOverview yearmonth={yearmonth} />
      </View>
    );
  }, []);
  const keyExtractor = useCallback((item: number) => item.toString(), []);
  const { styles } = useStyles(stylesheet);

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
        onScroll={(event) => {
          const position = Math.round(event.nativeEvent.contentOffset.x / DEVICE_LAYOUT.width);
          const yearmonth = initialYearmonth.addMonths(position - CENTER_POSITION);
          if (focusYearmonth.current?.compare(yearmonth) !== 0) {
            focusYearmonth.current = yearmonth;
            onChangeYearmonth && onChangeYearmonth(yearmonth);
          }
        }}
        onMomentumScrollEnd={(event) => {
          const position = Math.round(event.nativeEvent.contentOffset.x / DEVICE_LAYOUT.width);
          const yearmonth = initialYearmonth.addMonths(position - CENTER_POSITION);
          switchMode(yearmonth, 'immediate');
        }}
      />
    </View>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
  },
  body: {
    width: DEVICE_LAYOUT.width,
    height: '100%',
  },
});
