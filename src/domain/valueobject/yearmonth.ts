import { Month } from '@/src/domain/valueobject/types';

export default class Yearmonth {
  private constructor(
    public readonly year: number,
    public readonly month: Month,
  ) {}

  static build(year: number, month: Month) {
    return new Yearmonth(year, month);
  }

  addMonths(months: number) {
    const totalMonths = this.year * 12 + (this.month - 1) + months;
    const newYear = Math.floor(totalMonths / 12);
    const newMonth = (totalMonths % 12) + 1;

    return new Yearmonth(newYear, newMonth as Month);
  }

  subMonths(months: number) {
    return this.addMonths(-months);
  }

  compare(other: Yearmonth) {
    return this.year * 12 + this.month - (other.year * 12 + other.month);
  }

  toString() {
    return `${this.year}-${this.month.toString().padStart(2, '0')}`;
  }
}
