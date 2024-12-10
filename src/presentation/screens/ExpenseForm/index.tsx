import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { RouteProp, useNavigation, usePreventRemove, useRoute } from '@react-navigation/native';

import { CreateExpenseForm, UpdateExpenseForm } from '../../features/expenseForm';
import { RootStackParamList } from '../../navigation/root';

type ExpenseFormRouteProp = RouteProp<RootStackParamList, 'ExpenseForm'>;
export default function Page() {
  const route = useRoute<ExpenseFormRouteProp>();
  const { expenseId } = route.params;
  const navigation = useNavigation();

  const handleSaved = useCallback(
    (success: boolean, keeping: boolean) => {
      if (success && !keeping) {
        setForceBack(true);
        navigation.goBack();
      } else if (!success) Alert.alert('Failed to save');
      else if (keeping) Alert.alert('Saved');
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (success: boolean) => {
      if (success) {
        setForceBack(true);
        navigation.goBack();
      } else {
        Alert.alert('Failed to remove');
      }
    },
    [navigation],
  );

  const [forceBack, setForceBack] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);
  usePreventRemove(!forceBack && isDirty, () => {
    Alert.alert('変更内容を破棄しますか？', '', [
      {
        text: '破棄する',
        onPress: () => {
          setForceBack(true);
          navigation.goBack();
        },
        style: 'destructive',
      },
      { text: 'キャンセル' },
    ]);
  });

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  if (isLoading) return <View />;

  return (
    <View style={{ flex: 1 }}>
      {expenseId !== undefined ? (
        <UpdateExpenseForm
          expenseId={expenseId}
          onSaved={handleSaved}
          onRemoved={handleRemove}
          onDirtyChange={handleDirtyChange}
        />
      ) : (
        <CreateExpenseForm onSaved={handleSaved} onDirtyChange={handleDirtyChange} />
      )}
    </View>
  );
}
