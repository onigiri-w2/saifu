import React, { useCallback } from 'react';
import { Alert, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { CreateExpenseForm } from '../../features/expenseForm';

export default function Page() {
  const navigation = useNavigation();

  const handleSaved = useCallback(
    (success: boolean, keeping: boolean) => {
      if (success && !keeping) navigation.goBack();
      else if (!success) Alert.alert('Failed to save');
      else if (keeping) Alert.alert('Saved');
    },
    [navigation],
  );

  return (
    <View style={{ flex: 1 }}>
      <CreateExpenseForm onSaved={handleSaved} />
    </View>
  );
}
