import Transaction from '../../aggregation/transaction';
import LocalDate from '../../valueobject/localdate';
import { TransactionJournal } from '../transactionJournal/journal';

export interface DailySummary {
  date: LocalDate;
  total: number;
}

class TransactionTimeline {
  public readonly timeline: (DailySummary | Transaction)[] = [];

  constructor(private readonly journal: TransactionJournal) {
    this.timeline = this._build(journal);
  }

  reverse(): TransactionTimeline {
    const reversed = this.journal.reverse();
    return new TransactionTimeline(reversed);
  }

  private _build(journal: TransactionJournal): (DailySummary | Transaction)[] {
    const timeline: (DailySummary | Transaction)[] = [];

    journal.entries.forEach((entry) => {
      const date = entry.date;
      const dailySummary = entry.transactions.reduce((acc, transaction) => {
        return acc + transaction.amount.value * (transaction.type === 'income' ? 1 : -1);
      }, 0);
      timeline.push({ date, total: dailySummary });
      entry.transactions.forEach((transaction) => {
        timeline.push(transaction);
      });
    });

    return timeline;
  }
}
export default TransactionTimeline;
