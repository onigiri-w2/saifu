import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { DailySummary } from '@/src/domain/model/projection/transactionTimeline/timeline';
import Period from '@/src/domain/model/valueobject/period';

import { ExtendedTransaction, isExtendedTransaction } from '../../types';
import DailySummaryRow from '../DailySummaryRow';
import TransactionRow from '../TransactionRow';

import { useTimeline } from './hooks';

type Props = {
  period: Period;
  useDeferredRendering: boolean;
};
function Timeline({ period, useDeferredRendering }: Props) {
  const timeline = useTimeline(period, useDeferredRendering);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DailySummary | ExtendedTransaction>) => {
    if (isExtendedTransaction(item)) {
      return <TransactionRow extendedTransaction={item} />;
    }
    return <DailySummaryRow date={item.date} total={item.total} />;
  }, []);

  const keyExtractor = useCallback((item: DailySummary | ExtendedTransaction) => {
    if (isExtendedTransaction(item)) return item.transaction.id.value;
    return JSON.stringify(item.date);
  }, []);

  return <FlatList scrollEnabled={false} data={timeline} renderItem={renderItem} keyExtractor={keyExtractor} />;
}

export default Timeline;
