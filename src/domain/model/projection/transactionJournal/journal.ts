import Transaction from '../../aggregation/transaction';
import LocalDate from '../../valueobject/localdate';
import Period from '../../valueobject/period';

type DailyTransactionEntry = {
  date: LocalDate;
  transactions: Transaction[];
};
type Order = 'asc' | 'desc';

export class TransactionJournal {
  private constructor(
    public readonly entries: DailyTransactionEntry[],
    public readonly order: Order,
  ) {}

  reverse(): TransactionJournal {
    return new TransactionJournal(this.entries.slice().reverse(), this.order === 'asc' ? 'desc' : 'asc');
  }

  static fromTransactions(transactions: Transaction[], period: Period, order: 'asc' | 'desc'): TransactionJournal {
    const map = new Map<string, Transaction[]>();
    const result: DailyTransactionEntry[] = [];
    if (order === 'asc') {
      transactions.forEach((e) => {
        const key = LocalDate.fromDate(e.date).toString();
        map.set(key, (map.get(key) || []).concat(e));
      });
      period.genArray().forEach((d) => {
        if (map.has(d.toString())) {
          result.push({ date: d, transactions: map.get(d.toString())! });
        }
      });
    } else {
      transactions.forEach((e) => {
        const key = LocalDate.fromDate(e.date).toString();
        map.set(key, [e].concat(map.get(key) || []));
      });
      period
        .genArray()
        .reverse()
        .forEach((d) => {
          if (map.has(d.toString())) {
            result.push({ date: d, transactions: map.get(d.toString())! });
          }
        });
    }
    return new TransactionJournal(result, order);
  }
}
