import React from 'react';
import { View } from 'react-native';

import { NewExpenseForm } from '../../features/expenseForm';

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <NewExpenseForm />
    </View>
  );
}
