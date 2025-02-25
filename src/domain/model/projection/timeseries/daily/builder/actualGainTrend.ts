import ITransactionRepository from '@/src/domain/model/aggregation/transaction/repository.type';
import { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import LocalDate from '@/src/domain/model/valueobject/localdate';
import Period from '@/src/domain/model/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DailyTimeSeries } from '../timeseries';

export async function buildActualGain(
  categoryIds: TransactionCategoryId[],
  period: Period,
  transactionRepository: ITransactionRepository,
) {
  const start = period.start.datetime;
  const end = period.end.datetime;
  const expenses = await transactionRepository.findSome('income', categoryIds, start, end);
  const map = new HashMap<LocalDate, number>();
  expenses.forEach((e) => {
    map.set(LocalDate.fromDate(e.date), (map.get(LocalDate.fromDate(e.date)) ?? 0) + e.amount.value);
  });
  return DailyTimeSeries.fromMap(map, period);
}
