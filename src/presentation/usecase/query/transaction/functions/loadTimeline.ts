import { TransactionJournal } from '@/src/domain/model/projection/transactionJournal/journal';
import TransactionTimeline from '@/src/domain/model/projection/transactionTimeline/timeline';
import Period from '@/src/domain/model/valueobject/period';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export async function loadTimelineByPeriod(
  period: Period,
  { order = 'asc' }: { order: 'asc' | 'desc' },
): Promise<TransactionTimeline> {
  const repoRegistry = RepositoryRegistry.getInstance();

  const transactions = await repoRegistry.transactionRepository.findSome(
    'both',
    [],
    period.start.datetime,
    period.end.datetime,
  );

  const journal = TransactionJournal.fromTransactions(transactions, period, order);
  return new TransactionTimeline(journal);
}
