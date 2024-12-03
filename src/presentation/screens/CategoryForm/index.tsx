import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Alert, View } from 'react-native';

import { RouteProp, useNavigation, usePreventRemove, useRoute } from '@react-navigation/native';
import { ErrorBoundary } from 'react-error-boundary';
import { useStyles, createStyleSheet } from 'react-native-unistyles';

import ErrorFallback from '../../components/ErrorFallback';
import { SaveButton } from '../../components/PageHeader';
import CategoryBudgetFormWrapper, { CategoryBudgetFormRef } from '../../features/categoryForm';
import { RootStackParamList } from '../../navigation/root';

type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;
function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const params = route.params;
  const { styles } = useStyles(stylesheet);

  const navigation = useNavigation();
  const ref = useRef<CategoryBudgetFormRef>(null);

  const [forceBack, setForceBack] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const canSave = isDirty && isValid;

  const saveButton = useCallback(() => {
    const handleSave = async () => {
      const result = await ref.current?.save();
      if (result) {
        setForceBack(true);
        setTimeout(navigation.goBack, 0);
      }
    };

    return <SaveButton onPress={handleSave} disabled={!canSave} />;
  }, [canSave]);

  useEffect(() => {
    navigation.setOptions({
      title: params.categoryId ? 'カテゴリ更新' : '新規カテゴリ',
      headerRight: saveButton,
    });
  }, [saveButton]);

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

  const handleStateChange = useCallback((isDirty: boolean, isValid: boolean) => {
    setIsDirty(isDirty);
    setIsValid(isValid);
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <View style={styles.container}>
        <CategoryBudgetFormWrapper ref={ref} categoryId={params.categoryId} onStateChange={handleStateChange} />
      </View>
    </ErrorBoundary>
  );
}

export default Page;

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
}));
