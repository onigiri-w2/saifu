import Expense from '@/src/domain/aggregation/expense';
import Today from '@/src/domain/aggregation/today';
import { DomainValidationError } from '@/src/domain/error';
import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';

import Budget from '../../budget';
import DailyCostMap from '../../dailyCostMap';
import { DataPoint, ITimeSeries } from '../types';

export abstract class DailyTimeSeries<T extends DailyTimeSeries<T>> implements ITimeSeries {
  protected constructor(public readonly points: readonly DataPoint[]) {
    this._validate();
  }

  getPeriod(): Period {
    return Period.build(this.points[0].date, this.points[this.points.length - 1].date);
  }

  // otherの中でperiodが被る部分の値を取得して自身の値を上書きする
  override(other: T): T {
    const overridePeriod = Period.intersect(this.getPeriod(), other.getPeriod());
    if (overridePeriod === undefined) return this as unknown as T;

    const newPoints = [...this.points];
    const dates = overridePeriod.genArray();

    dates.forEach((date) => {
      const index = newPoints.findIndex((p) => p.date.isSame(date));
      const otherPoint = other.points.find((p) => p.date.isSame(date));
      if (index >= 0 && otherPoint) {
        newPoints[index] = otherPoint;
      }
    });

    return new (this.constructor as new (points: readonly DataPoint[]) => T)(newPoints);
  }

  aggregate(others: T[]): T {
    const aggregatePoints = this.points.map((point) => {
      const value = others.reduce((acc, other) => {
        const otherPoint = other.points.find((p) => p.date.isSame(point.date));
        return acc + (otherPoint?.value ?? 0);
      }, point.value);
      return { date: point.date, value };
    });

    return new (this.constructor as new (points: readonly DataPoint[]) => T)(aggregatePoints);
  }

  private _validate(): void {
    if (this.points.length === 0) {
      throw new DomainValidationError('データポイントが空です');
    }
  }
}

export class DailyActualCostStock extends DailyTimeSeries<DailyActualCostStock> {
  private constructor(points: readonly DataPoint[]) {
    super(points);
  }
  static build(expenses: Expense[], period: Period): DailyActualCostStock {
    const dailyCost = DailyCostMap.fromList(expenses);
    const dates = period.genArray();
    const points: DataPoint[] = [];
    let accumulated = 0;

    for (const date of dates) {
      accumulated += dailyCost.get(date) ?? 0;
      points.push({ date, value: accumulated });
    }
    return new DailyActualCostStock(points);
  }
}

export class DailyForecastCostStock extends DailyTimeSeries<DailyForecastCostStock> {
  private constructor(points: readonly DataPoint[]) {
    super(points);
  }
  static build(
    budgets: Budget[],
    actualExpenses: Expense[],
    requestedPeriod: Period,
    today: Today,
  ): DailyForecastCostStock | undefined {
    if (requestedPeriod.end.isBeforeThan(today.date)) return undefined;

    // Note: budgets === 0 の場合は、actualExpenses だけでシンプルに予測
    let forecastDailyCost = DailyCostMap.fromList(actualExpenses);
    budgets.forEach((budget) => {
      forecastDailyCost = forecastDailyCost.merge(budget.allocate(forecastDailyCost, today));
    });

    // 予測可能な期間を明示的に計算
    const forecastablePeriod = Period.build(LocalDate.max([today.date, requestedPeriod.start]), requestedPeriod.end);
    const dates = requestedPeriod.genArray();
    const points: DataPoint[] = [];
    let accumulated = 0;
    for (const date of dates) {
      accumulated += forecastDailyCost.get(date) ?? 0;
      points.push({ date, value: accumulated });
    }
    return new DailyForecastCostStock(points.filter((p) => forecastablePeriod.includes(p.date)));
  }
}

/**
 * 実績データを基本として、未来期間を予測データで補完した時系列データ
 * 過去の期間は実績値を正とし、未来の期間は予測値で補完する
 */
export class DailyProjectedCostStock extends DailyTimeSeries<DailyProjectedCostStock> {
  private constructor(points: readonly DataPoint[]) {
    super(points);
  }

  static build(actual: DailyActualCostStock, forecast: DailyForecastCostStock | undefined): DailyProjectedCostStock {
    if (!forecast) return new DailyProjectedCostStock(actual.points);

    return new DailyProjectedCostStock(actual.override(forecast).points);
  }

  static buildAllZero(period: Period): DailyProjectedCostStock {
    const dates = period.genArray();
    const points = dates.map((date) => ({ date, value: 0 }));
    return new DailyProjectedCostStock(points);
  }
}
