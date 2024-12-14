import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Alert, View } from 'react-native';

import { RouteProp, useNavigation, usePreventRemove, useRoute } from '@react-navigation/native';
import { ErrorBoundary } from 'react-error-boundary';
import { useStyles, createStyleSheet } from 'react-native-unistyles';

import ErrorFallback from '../../components/ErrorFallback';
import { SaveButton } from '../../components/PageHeader';
import CategoryForm from '../../features/categoryForm';
import { CategoryBudgetFormRef } from '../../features/categoryForm/types';
import { RootStackParamList } from '../../navigation/root';

type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const params = route.params;

  const navigation = useNavigation();
  const ref = useRef<CategoryBudgetFormRef>(null);

  const [forceBack, setForceBack] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const canSave = isDirty && isValid;

  const saveButton = useCallback(() => {
    const handleSave = async () => {
      const result = ref.current?.save();
      if (result !== undefined) {
        setForceBack(true);
        setTimeout(navigation.goBack, 0);
      }
    };

    return <SaveButton onPress={handleSave} disabled={!canSave} />;
  }, [canSave]);

  useEffect(() => {
    setTimeout(() => {
      navigation.setOptions({
        title: params.categoryId !== undefined ? 'カテゴリ更新' : '新規カテゴリ',
        headerRight: saveButton,
      });
    }, 0);
  }, [saveButton]);

  const handleStateChange = useCallback((isDirty: boolean, isValid: boolean) => {
    setIsDirty(isDirty);
    setIsValid(isValid);
  }, []);

  const { styles } = useStyles(stylesheet);

  // iOSでこのスクリーン表示する際、以下がないと開くの200msくらい遅れるので追加
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
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

  const key = (params.categoryId ?? 'new') + params.timestamp;

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <View style={styles.container}>
        {!isLoading && (
          <CategoryForm key={key} ref={ref} categoryId={params.categoryId} onStateChange={handleStateChange} />
        )}
      </View>
    </ErrorBoundary>
  );
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
  },
}));
