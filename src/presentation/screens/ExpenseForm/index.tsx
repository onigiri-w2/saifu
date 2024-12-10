import React, { useCallback } from 'react';
import { Alert, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { CreateExpenseForm } from '../../features/expenseForm';

export default function Page() {
  const navigation = useNavigation();

  const handleSaved = useCallback(
    (success: boolean) => {
      if (success) navigation.goBack();
      else Alert.alert('Failed to save');
    },
    [navigation],
  );

  return (
    <View style={{ flex: 1 }}>
      <CreateExpenseForm onSaved={handleSaved} />
    </View>
  );
}
