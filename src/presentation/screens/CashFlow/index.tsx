import React from 'react';
import { View } from 'react-native';

import CostUsage from '@/src/presentation/features/costUsage';

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <CostUsage />
    </View>
  );
}
