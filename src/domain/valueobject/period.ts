import { ValidationError } from '../error';

import LocalDate from './localdate';

class Period {
  public readonly length!: number;
  private constructor(
    public readonly start: LocalDate,
    public readonly end: LocalDate,
  ) {
    this._validate();
    this.length = this.end.diffDays(this.start) + 1;
  }

  public includes(date: LocalDate) {
    return date.isAfterOrEqual(this.start) && date.isBeforeOrEqual(this.end);
  }
  public isSame(other: Period) {
    return this.start.isSame(other.start) && this.end.isSame(other.end);
  }
  public genArray(): LocalDate[] {
    const result = [];
    let current = this.start;

    while (current.isBeforeOrEqual(this.end)) {
      result.push(current);
      current = current.addDays(1);
    }
    return result;
  }

  /**
   * 複数のPeriodを統合し、重複や隙間を埋めた新しいPeriodを返す
   * @param periods 統合するPeriodの配列
   * @returns 統合されたPeriod、または入力が空の場合はundefined
   */
  static combine(periods: Period[]): Period | undefined {
    if (periods.length === 0) return undefined;

    // 開始日でソート
    const sorted = periods.sort((a, b) => a.start.compare(b.start));

    const start = sorted[0].start;
    let end = sorted[0].end;

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      if (current.start.isAfterThan(end)) {
        // 現在のPeriodが前のPeriodと離れている場合、endを更新
        end = current.end;
      } else if (current.end.isAfterThan(end)) {
        // 現在のPeriodが前のPeriodに含まれている場合、endを更新
        end = current.end;
      }
    }
    return new Period(start, end);
  }

  static build(start: LocalDate, end: LocalDate) {
    return new Period(start, end);
  }
  private _validate() {
    if (this.start.isAfterThan(this.end)) {
      throw new ValidationError('startはendと同じ日もしくは前の日である必要があります', {
        context: {
          start: this.start,
          end: this.end,
        },
      });
    }
  }
}

export default Period;
