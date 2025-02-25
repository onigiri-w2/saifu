import { HashMap } from '@/src/utils/collections';

import LocalDate from '../../valueobject/localdate';
import Period from '../../valueobject/period';
import { DailyTimeSeries } from '../timeseries/daily/timeseries';

import Budget from '.';

describe('Budget.allocateTo', () => {
  describe('[budget.periodとbaseseries.periodが一致していない場合] => エラー', () => {
    test('budget.period: 2021-01-01 ~ 2021-01-03, baseseries.period: 2021-02-01 ~ 2021-02-03', () => {
      const baseSeriesStart = LocalDate.build(2021, 2, 1);
      const baseSeries = buildTimeseriesTestHelper([10, 20, 30], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      expect(() => sut.allocateTo(baseSeries, baseSeriesStart)).toThrow();
    });
    test('budget.period: 2021-01-01 ~ 2021-01-03, baseseries.period: 2021-01-01 ~ 2021-01-02', () => {
      const baseSeriesStart = LocalDate.build(2021, 1, 1);
      const baseSeries = buildTimeseriesTestHelper([10, 20], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      expect(() => sut.allocateTo(baseSeries, baseSeriesStart)).toThrow();
    });
  });
  describe('[requestedStartDateがbudget.period.endより後の場合] => baseseriesをそのまま返す', () => {
    test('budget.period: 2021-01-01 ~ 2021-01-03, requestedStartDate: 2021-01-04', () => {
      const baseSeriesStart = LocalDate.build(2021, 1, 1);
      const baseSeries = buildTimeseriesTestHelper([10, 20, 30], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      const actual = sut.allocateTo(baseSeries, LocalDate.build(2021, 1, 4));

      expect(actual).toBe(baseSeries);
    });
  });
  describe('[requestedStartDateがbudget.period.startより前の場合] => period全体が予算振り分け対象になる', () => {
    test('budget.period: 2021-01-01 ~ 2021-01-03, requestedStartDate: 2020-12-31', () => {
      const baseSeriesStart = LocalDate.build(2021, 1, 1);
      const baseSeries = buildTimeseriesTestHelper([0, 0, 0], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      const actual = sut.allocateTo(baseSeries, LocalDate.build(2020, 12, 31));
      // 少し実装詳細に依存してるかも（でも、IFの返り値データやし、まあいいか）
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBeGreaterThan(0);
      expect(values[1]).toBeGreaterThan(0);
      expect(values[2]).toBeGreaterThan(0);
    });
  });

  describe('[requestedStartDateがbudget.period内の場合] => requestedStartDateからbudget.period.endに予算振り分け', () => {
    test('budget.period: 2021-01-01 ~ 2021-01-03, requestedStartDate: 2021-01-01', () => {
      const baseSeriesStart = LocalDate.build(2021, 1, 1);
      const baseSeries = buildTimeseriesTestHelper([0, 0, 0], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      const actual = sut.allocateTo(baseSeries, LocalDate.build(2021, 1, 1));
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBeGreaterThan(0);
      expect(values[1]).toBeGreaterThan(0);
      expect(values[2]).toBeGreaterThan(0);
    });
    test('budget.period: 2021-01-01 ~ 2021-01-03, requestedStartDate: 2021-01-02', () => {
      const baseSeriesStart = LocalDate.build(2021, 1, 1);
      const baseSeries = buildTimeseriesTestHelper([0, 0, 0], baseSeriesStart);

      const sut = Budget.forTesting(100, Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 3)));

      const actual = sut.allocateTo(baseSeries, LocalDate.build(2021, 1, 2));
      const values = actual.asFlow().map((v) => v.value);

      expect(values[0]).toBe(0);
      expect(values[1]).toBeGreaterThan(0);
      expect(values[2]).toBeGreaterThan(0);
    });
  });
});

function buildTimeseriesTestHelper(
  numbers: number[],
  startDate: LocalDate = LocalDate.build(2021, 1, 1),
): DailyTimeSeries {
  const period = Period.build(startDate, startDate.addDays(numbers.length - 1));
  const entries = numbers.map((n, i) => [startDate.addDays(i), n] as [LocalDate, number]);
  const map = new HashMap<LocalDate, number>(entries);
  return DailyTimeSeries.fromMap(map, period);
}
