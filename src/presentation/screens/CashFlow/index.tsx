import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import Yearmonth from '@/src/domain/valueobject/yearmonth';
import CostUsage from '@/src/presentation/features/costUsage';

import { utilStyleSheet } from '../../style/utilStyleSheet';
import { loadToday } from '../../usecase/query/today/functions';

import HeaderTitle from './components/HeaderTitle';

export default function Page() {
  const { styles } = useStyles(utilStyleSheet);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [headerYearmonth, setHeaderYearmonth] = useState<Yearmonth>();
  const [initialYearmonth, setInitialYearmonth] = useState<Yearmonth>();

  const handleChangeYearmonth = useCallback((yearmonth: Yearmonth) => {
    setHeaderYearmonth(yearmonth);
  }, []);
  useEffect(() => {
    if (!headerYearmonth) return;
    navigation.setOptions({
      headerTitle: () => <HeaderTitle yearmonth={headerYearmonth} />,
    });
  }, [navigation, headerYearmonth]);

  useEffect(() => {
    loadToday().then((today) => {
      const date = today.date;
      setInitialYearmonth(Yearmonth.build(date.year, date.month));
      setHeaderYearmonth(Yearmonth.build(date.year, date.month));
    });
  }, []);

  if (!initialYearmonth) return null;

  return (
    <View style={styles.screen}>
      <CostUsage
        initialYearmonth={initialYearmonth}
        useDeferredRndering={!isFocused}
        onChangeYearmonth={handleChangeYearmonth}
      />
    </View>
  );
}
