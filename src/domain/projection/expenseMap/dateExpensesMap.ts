import { HashMap } from '@/src/utils/collections';

import Expense from '../../aggregation/expense';
import LocalDate from '../../valueobject/localdate';
import DailyCostMap from '../dailyCostMap';

class DateExpensesMap {
  private constructor(public readonly map: HashMap<LocalDate, Expense[]>) {}

  genTotalEachDate(): DailyCostMap {
    const map = new HashMap<LocalDate, number>();
    for (const [date, expenses] of this._entries()) {
      let total = 0;
      for (const expense of expenses) {
        total += expense.amount.value;
      }
      map.set(date, total);
    }
    return DailyCostMap.build(map);
  }

  static build(map: HashMap<LocalDate, Expense[]>): DateExpensesMap {
    return new DateExpensesMap(map);
  }
  static fromList(expenses: Expense[]): DateExpensesMap {
    const map = new HashMap<LocalDate, Expense[]>();
    for (const expense of expenses) {
      const date = LocalDate.fromDate(expense.date);
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(expense);
    }
    return new DateExpensesMap(map);
  }

  private _entries(): [LocalDate, Expense[]][] {
    return Array.from(this.map.entries()).map(([hash, value]) => {
      return [LocalDate.decode(hash), value];
    });
  }

  toJSON() {
    return this.map.toJSON();
  }
}
export default DateExpensesMap;
