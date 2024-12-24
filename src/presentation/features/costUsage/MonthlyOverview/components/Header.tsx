import React from 'react';
import { View } from 'react-native';

import { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Today from '@/src/domain/aggregation/today';
import { CostStock } from '@/src/presentation/usecase/query/projected-coststock/functions';
import { JsonLocalDate } from '@/src/presentation/utils/reanimated/types';

import CostChart from './CostChart';
import Title from './Title';

type Props = {
  stock: CostStock;
  focusDate: SharedValue<JsonLocalDate>;
  today: Today;
};
function Header({ stock, focusDate, today }: Props) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Title stock={stock} focusDate={focusDate} />
      <CostChart stock={stock} today={today} focusDate={focusDate} />
    </View>
  );
}
export default React.memo(Header);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginBottom: theme.spacing.x3,
    paddingHorizontal: theme.spacing.x4,
    gap: theme.spacing.x6,
  },
}));
