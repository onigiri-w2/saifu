import { HashMap } from '@/src/utils/collections';

import { ValidationError } from '../error';

import LocalDate from './localdate';
import Period from './period';

export type TimeSeriesDataPoint = {
  date: LocalDate;
  value: number;
};
export interface ITimeSeries {
  readonly points: readonly TimeSeriesDataPoint[];
  getPeriod(): Period;
}

export class DailyStock implements ITimeSeries {
  private constructor(public readonly points: readonly TimeSeriesDataPoint[]) {}

  static fromMap(map: HashMap<LocalDate, number>, period: Period): DailyStock {
    const dates = period.genArray();
    const values: TimeSeriesDataPoint[] = [];

    for (const date of dates) {
      const prevValue = map.get(date.subDays(1));
      const value = map.get(date) ?? prevValue ?? 0;
      values.push({ date, value });
    }
    return new DailyStock(values);
  }

  static fromPoints(points: TimeSeriesDataPoint[]): DailyStock {
    const sorted = points.sort((a, b) => a.date.compare(b.date));
    const period = Period.build(sorted[0].date, sorted[sorted.length - 1].date);
    const map = new HashMap<LocalDate, number>(points.map((p) => [p.date, p.value]));
    return DailyStock.fromMap(map, period);
  }

  toFlow(): DailyFlow {
    const newPoints: TimeSeriesDataPoint[] = [];
    let prevValue = 0;
    for (const point of this.points) {
      newPoints.push({ date: point.date, value: point.value - prevValue });
      prevValue = point.value;
    }

    return DailyFlow.fromPoints(newPoints);
  }

  static aggregate(stocks: DailyStock[], period: Period): DailyStock {
    if (stocks.length === 0) {
      throw new ValidationError('DailyStockが1つもありません', { context: { length: stocks.length } });
    }
    // 結果を格納するためのマップを初期化
    const resultMap = new HashMap<LocalDate, number>();

    // 各stockのpointsをdateでインデックス化して高速アクセスできるようにする
    const stockMaps = stocks.map((stock) => {
      const pointMap = new HashMap<LocalDate, number>();
      stock.points.forEach((point) => {
        pointMap.set(point.date, point.value);
      });
      return pointMap;
    });

    // 期間内の各日付について集計を行う
    for (const date of period.genArray()) {
      let sum = 0;
      // 各stockの対応する日付のデータを取得して合算
      for (const stockMap of stockMaps) {
        const value = stockMap.get(date);
        if (value !== undefined) {
          sum += value;
        }
      }
      resultMap.set(date, sum);
    }

    return DailyStock.fromMap(resultMap, period);
  }

  static empty(period: Period): DailyStock {
    const dates = period.genArray();
    const values: TimeSeriesDataPoint[] = [];
    for (const date of dates) {
      values.push({ date, value: 0 });
    }
    return new DailyStock(values);
  }

  getPeriod(): Period {
    return Period.build(this.points[0].date, this.points[this.points.length - 1].date);
  }
  calculateSumValue(to?: LocalDate): number {
    if (to) {
      const filtered = this.points.filter((p) => p.date.compare(to) <= 0);
      return filtered.reduce((acc, p) => acc + p.value, 0);
    }
    return this.points.reduce((acc, p) => acc + p.value, 0);
  }
}

export class DailyFlow implements ITimeSeries {
  private constructor(public readonly points: readonly TimeSeriesDataPoint[]) {}

  static fromMap(map: HashMap<LocalDate, number>, period: Period): DailyFlow {
    const dates = period.genArray();
    const values: TimeSeriesDataPoint[] = [];
    for (const d of dates) {
      values.push({ date: d, value: map.get(d) ?? 0 });
    }
    return new DailyFlow(values);
  }

  static fromPoints(points: TimeSeriesDataPoint[]): DailyFlow {
    const sorted = points.sort((a, b) => a.date.compare(b.date));
    const period = Period.build(sorted[0].date, sorted[sorted.length - 1].date);
    const map = new HashMap<LocalDate, number>(points.map((p) => [p.date, p.value]));
    return DailyFlow.fromMap(map, period);
  }

  static merge(flows: DailyFlow[]): DailyFlow {
    if (flows.length === 0) throw new Error('flows must not be empty');

    const map = new HashMap<LocalDate, number>();
    for (const flow of flows) {
      for (const point of flow.points) {
        map.set(point.date, map.get(point.date) ?? 0 + point.value);
      }
    }
    return DailyFlow.fromMap(map, flows[0].getPeriod());
  }

  toStock(): DailyStock {
    const newPoints: TimeSeriesDataPoint[] = [];
    let sum = 0;
    for (const point of this.points) {
      sum += point.value;
      newPoints.push({ date: point.date, value: sum });
    }

    return DailyStock.fromPoints(newPoints);
  }
  getPeriod(): Period {
    return Period.build(this.points[0].date, this.points[this.points.length - 1].date);
  }
}
