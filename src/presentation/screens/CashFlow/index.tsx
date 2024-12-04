import React from 'react';
import { View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import CostUsage from '@/src/presentation/features/costUsage';

export default function Page() {
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1 }}>
      <CostUsage useDeferredRndering={!isFocused} />
    </View>
  );
}
