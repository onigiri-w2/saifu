import { DomainValidationError } from '@/src/domain/error';
import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DataPoint, ITimeSeries } from '../types';

export class DailyTimeSeries implements ITimeSeries {
  private constructor(private flowpoints: DataPoint[]) {
    this._validate();
  }

  fromMap(map: HashMap<LocalDate, number>, period: Period): DailyTimeSeries {
    const dates = period.genArray();
    const flowpoints = dates.map((date) => ({ date, value: map.get(date) ?? 0 }));
    return new DailyTimeSeries(flowpoints);
  }

  get length(): number {
    return this.flowpoints.length;
  }

  asFlow(): DataPoint[] {
    return this.flowpoints;
  }
  asStock(): DataPoint[] {
    let sum = 0;
    return this.flowpoints.map((point) => {
      sum += point.value;
      return { date: point.date, value: sum };
    });
  }

  set(date: LocalDate, value: number) {
    const index = this.flowpoints.findIndex((p) => p.date.isSame(date));
    if (index === -1) throw new DomainValidationError('指定された日付のデータポイントが存在しません');
    this.flowpoints[index] = { date, value };
  }
  get(date: LocalDate): number | undefined {
    const point = this.flowpoints.find((p) => p.date.isSame(date));
    return point?.value;
  }

  cloneWith(): DailyTimeSeries {
    const newPoints: DataPoint[] = [];
    this.flowpoints.forEach((point) => {
      newPoints.push({ date: point.date, value: point.value });
    });
    return new DailyTimeSeries(newPoints);
  }

  getPeriod(): Period {
    return Period.build(this.flowpoints[0].date, this.flowpoints[this.flowpoints.length - 1].date);
  }

  // otherの中でperiodが被る部分の値を取得して自身の値を上書きする
  override(other: DailyTimeSeries): void {
    const overridePeriod = Period.intersect(this.getPeriod(), other.getPeriod());
    if (overridePeriod === undefined) return;

    const dates = overridePeriod.genArray();

    dates.forEach((date) => {
      const index = this.flowpoints.findIndex((p) => p.date.isSame(date));
      const otherPoint = other.flowpoints.find((p) => p.date.isSame(date));
      if (index >= 0 && otherPoint) {
        this.flowpoints[index] = otherPoint;
      }
    });
  }

  aggregate(others: DailyTimeSeries[]) {
    const aggregatePoints = this.flowpoints.map((point) => {
      const value = others.reduce((acc, other) => {
        const otherPoint = other.flowpoints.find((p) => p.date.isSame(point.date));
        return acc + (otherPoint?.value ?? 0);
      }, point.value);
      return { date: point.date, value };
    });

    this.flowpoints = aggregatePoints;
  }

  equals(other: DailyTimeSeries): boolean {
    if (this.flowpoints.length !== other.flowpoints.length) return false;
    if (
      this.flowpoints.some(
        (point, i) => !point.date.isSame(other.flowpoints[i].date) || point.value !== other.flowpoints[i].value,
      )
    ) {
      return false;
    }
    return true;
  }

  // Note: 重なる部分のみを抽出する
  extract(start: LocalDate, end: LocalDate): DailyTimeSeries {
    if (start.isAfterThan(end)) throw new DomainValidationError('startがendより後の日付です');

    const period = Period.build(start, end);

    const flowpoints = this.flowpoints.filter((point) => period.includes(point.date));
    return new DailyTimeSeries(flowpoints);
  }

  calcSum(): number {
    return this.flowpoints.reduce((acc, point) => acc + point.value, 0);
  }

  updateFlowWithNumbers(flow: number[]) {
    for (let i = 0; i < this.flowpoints.length; i++) {
      this.flowpoints[i].value = flow[i];
    }
  }

  static buildAllZero(period: Period): DailyTimeSeries {
    const dates = period.genArray();
    const flowpoints = dates.map((date) => ({ date, value: 0 }));
    return new DailyTimeSeries(flowpoints);
  }

  static fromMap(map: HashMap<LocalDate, number>, period: Period): DailyTimeSeries {
    const dates = period.genArray();
    const flowpoints = dates.map((date) => ({ date, value: map.get(date) ?? 0 }));
    return new DailyTimeSeries(flowpoints);
  }

  private _validate(): void {
    if (this.flowpoints.length === 0) {
      throw new DomainValidationError('データポイントが空です');
    }
  }
}
