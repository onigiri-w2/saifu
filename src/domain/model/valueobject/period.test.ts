import LocalDate from './localdate';
import Period from './period';

describe('Period.merge', () => {
  describe('[periodsが0の場合] => undefinedが返る', () => {
    test('periods = [], => undefined', () => {
      const periods: Period[] = [];
      const result = Period.merge(periods);
      expect(result).toBeUndefined();
    });
  });
  describe('[periodsが1つの場合] => そのperiodが返る', () => {
    test('periods = [2021-01-01 ~ 2021-01-31], => 2021-01-01 ~ 2021-01-31', () => {
      const periods: Period[] = [Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31))];
      const result = Period.merge(periods);
      expect(result).toEqual(Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)));
    });
  });
  describe('[2つ以上のperiod ^ 全て重ならない] => 全てがちょうど含まるperiodが返る', () => {
    test('periods = [2021-01-01 ~ 2021-01-31, 2021-02-01 ~ 2021-02-28], => 2021-01-01 ~ 2021-02-28', () => {
      const periods: Period[] = [
        Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
        Period.build(LocalDate.build(2021, 2, 1), LocalDate.build(2021, 2, 28)),
      ];
      const result = Period.merge(periods);
      expect(result).toEqual(Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 2, 28)));
    });
    test('periods = [2021-01-01 ~ 2021-01-31, 2021-03-01 ~ 2021-03-31], => 2021-01-01 ~ 2021-03-31', () => {
      const periods: Period[] = [
        Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
        Period.build(LocalDate.build(2021, 3, 1), LocalDate.build(2021, 3, 31)),
      ];
      const result = Period.merge(periods);
      expect(result).toEqual(Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 3, 31)));
    });
  });
  describe('[2つ以上のperiod ^ 一部が重なる] => 重なる部分が含まれるperiodが返る', () => {
    test('periods = [2021-01-01 ~ 2021-01-31, 2021-01-15 ~ 2021-02-15], => 2021-01-01 ~ 2021-02-15', () => {
      const periods: Period[] = [
        Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
        Period.build(LocalDate.build(2021, 1, 15), LocalDate.build(2021, 2, 15)),
      ];
      const result = Period.merge(periods);
      expect(result).toEqual(Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 2, 15)));
    });
    test('periods = [2021-01-01 ~ 2021-01-31, 2021-01-15 ~ 2021-02-15, 2021-02-10 ~ 2021-03-10], => 2021-01-01 ~ 2021-03-10', () => {
      const periods: Period[] = [
        Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
        Period.build(LocalDate.build(2021, 1, 15), LocalDate.build(2021, 2, 15)),
        Period.build(LocalDate.build(2021, 2, 10), LocalDate.build(2021, 3, 10)),
      ];
      const result = Period.merge(periods);
      expect(result).toEqual(Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 3, 10)));
    });
  });
});
