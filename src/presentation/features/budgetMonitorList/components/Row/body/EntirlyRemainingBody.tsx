import React from 'react';
import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ClockSvg from '@/assets/icons/lucide/clock.svg';
import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';
import { numberFormat } from '@/src/presentation/i18n/format';

type Props = {
  monitor: ThisCycleMonitor;
};
function Body({ monitor }: Props) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.content}>
      <Text style={styles.moneyText}>{numberFormat(monitor.remainingEntirlyMoney())}</Text>
      <View style={styles.dayWrap}>
        <ClockSvg width={DAY_ICON_SIZE} height={DAY_ICON_SIZE} stroke={theme.colors.text.primary} />
        <Text style={styles.dayText}>{monitor.remainingEntirlyDays()}日</Text>
      </View>
    </View>
  );
}

export default React.memo(Body);

const DAY_ICON_SIZE = 12;
const stylesheet = createStyleSheet((theme) => ({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyText: {
    fontSize: theme.fontSize.subHeading,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  dayWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xhalf,
  },
  dayText: {
    fontSize: DAY_ICON_SIZE,
    color: theme.colors.text.secondary,
  },
}));
