import React from 'react';
import { View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import CostUsage from '@/src/presentation/features/costUsage';

import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const isFocused = useIsFocused();
  const { styles } = useStyles(utilStyleSheet);

  return (
    <View style={styles.screen}>
      <CostUsage useDeferredRndering={!isFocused} />
    </View>
  );
}
