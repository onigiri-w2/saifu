import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DailyTimeSeries } from './timeseries';

describe('DailyTimeSeries.override', () => {
  describe('[otherの期間が自身の期間内の場合] => 重なる期間部分をotherの値で上書き', () => {
    test('this.period = 2021-01-01 ~ 2021-01-03, other.period = 2021-01-01 ~ 2021-01-03', () => {
      const sut = buildTimeSeriesHelper([1, 2, 3]);
      const other = buildTimeSeriesHelper([10, 20, 30]);

      sut.override(other);
      const values = sut.asFlow().map((e) => e.value);

      expect(values).toEqual([10, 20, 30]);
    });
    test('this.period = 2021-01-01 ~ 2021-01-03, other.period = 2021-01-02 ~ 2021-01-02', () => {
      const sut = buildTimeSeriesHelper([1, 2, 3]);
      const other = buildTimeSeriesHelper([10], LocalDate.build(2021, 1, 2));

      sut.override(other);
      const values = sut.asFlow().map((e) => e.value);

      expect(values).toEqual([1, 10, 3]);
    });
  });
  describe('[otherの期間が完全に自身の期間外の場合] => 何も起きない', () => {
    test('this.period = 2021-01-01 ~ 2021-01-03, other.period = 2021-01-04 ~ 2021-01-05', () => {
      const sut = buildTimeSeriesHelper([1, 2, 3]);
      const other = buildTimeSeriesHelper([10, 20], LocalDate.build(2021, 1, 4));

      sut.override(other);
      const values = sut.asFlow().map((e) => e.value);

      expect(values).toEqual([1, 2, 3]);
    });
  });
  describe('[otherの期間が自身の期間と一部重なる場合] => 重なる期間だけ値上書きしてそれ以上は何もない', () => {
    test('this.period = 2021-01-01 ~ 2021-01-03, other.period = 2021-01-02 ~ 2021-01-04', () => {
      const sut = buildTimeSeriesHelper([1, 2, 3]);
      const other = buildTimeSeriesHelper([10, 20, 30], LocalDate.build(2021, 1, 2));

      sut.override(other);
      const values = sut.asFlow().map((e) => e.value);

      expect(values).toEqual([1, 10, 20]);
    });
    test('this.period = 2021-01-01 ~ 2021-01-03, other.period = 2020-12-31 ~ 2021-01-05', () => {
      const sut = buildTimeSeriesHelper([1, 2, 3]);
      const other = buildTimeSeriesHelper([10, 20, 30, 40, 50], LocalDate.build(2020, 12, 31));

      sut.override(other);
      const values = sut.asFlow().map((e) => e.value);

      expect(values).toEqual([20, 30, 40]);
    });
  });
});

function buildTimeSeriesHelper(numbers: number[], startDate: LocalDate = LocalDate.build(2021, 1, 1)): DailyTimeSeries {
  const period = Period.build(startDate, startDate.addDays(numbers.length - 1));
  const entries = numbers.map((n, i) => [startDate.addDays(i), n] as [LocalDate, number]);
  const map = new HashMap<LocalDate, number>(entries);
  return DailyTimeSeries.fromMap(map, period);
}
