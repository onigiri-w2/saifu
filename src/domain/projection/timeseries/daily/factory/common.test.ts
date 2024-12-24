import Expense from '@/src/domain/aggregation/expense';
import LocalDate from '@/src/domain/valueobject/localdate';
import Money from '@/src/domain/valueobject/money';
import Period from '@/src/domain/valueobject/period';

import { createFromExpenses } from './common';

function buildExpenseTestHelper({
  category = 'category',
  amount = 100,
  date = new Date(2021, 1, 1, 0, 0, 0),
  memo = 'memo',
}: {
  category?: string;
  amount?: number;
  date?: Date;
  memo?: string;
}): Expense {
  return Expense.create(category, Money.build(amount), date, memo);
}

describe('createFromExpenses', () => {
  describe('[expensesが空の場合] => 全日0のTimeSeries', () => {
    test('expenses: [], period: 2021-1-1 ~ 2020-1-3', () => {
      const expenses: Expense[] = [];
      const period = Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3));

      const actual = createFromExpenses(expenses, period);
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBe(0);
      expect(values[1]).toBe(0);
      expect(values[2]).toBe(0);
    });
  });
  describe('[同じ日付を持つExpenseがある場合] => 同じ日で値が合計される', () => {
    test('expenses: [2021-1-1: 100, 2021-1-1: 200], period: 2021-1-1 ~ 2020-1-3', () => {
      const expenses: Expense[] = [
        buildExpenseTestHelper({ date: new Date(2021, 0, 1, 23, 59, 59), amount: 100 }),
        buildExpenseTestHelper({ date: new Date(2021, 0, 1, 0, 0, 0), amount: 200 }),
      ];
      const period = Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3));

      const actual = createFromExpenses(expenses, period);
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBe(300);
      expect(values[1]).toBe(0);
      expect(values[2]).toBe(0);
    });
  });
  describe('[異なる日付を持つExpenseがある場合] => 日付ごとに値が合計される', () => {
    test('expenses: [2021-1-1: 100, 2021-1-2: 200], period: 2021-1-1 ~ 2020-1-3', () => {
      const expenses: Expense[] = [
        buildExpenseTestHelper({ date: new Date(2021, 0, 1, 23, 59, 59), amount: 100 }),
        buildExpenseTestHelper({ date: new Date(2021, 0, 2, 0, 0, 0), amount: 200 }),
      ];
      const period = Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3));

      const actual = createFromExpenses(expenses, period);
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBe(100);
      expect(values[1]).toBe(200);
      expect(values[2]).toBe(0);
    });
  });
});
