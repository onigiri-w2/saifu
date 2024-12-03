import { Day, DayOfWeek, Month } from '@/src/domain/valueobject/types';
import { NotImplementedError } from '@/src/utils/errors';

import LocalDate from './localdate';
import Period from './period';
import Yearmonth from './yearmonth';

class CycleStartDef {
  private constructor(
    public readonly startYear: Month,
    public readonly startMonth: Day,
    public readonly startWeek: DayOfWeek,
  ) {}

  static build(startYear: Month, startMonth: Day, startWeek: DayOfWeek) {
    return new CycleStartDef(startYear, startMonth, startWeek);
  }

  public genYearPeriod(referenceDate: LocalDate): Period {
    let start = LocalDate.build(referenceDate.year, this.startYear, this.startMonth);
    start = start.isBeforeOrEqual(referenceDate) ? start : start.addYears(-1);
    const end = start.addYears(1).addDays(-1);
    return Period.build(start, end);
  }
  public genMonthPeriod(referenceDate: LocalDate): Period {
    const ym = Yearmonth.build(referenceDate.year, referenceDate.month);
    const result = this.genMonthPeriodYm(ym);
    if (result.includes(referenceDate)) return result;
    else return this.genMonthPeriodYm(ym.subMonths(1));
  }
  public genWeekPeriod(referenceDate: LocalDate): Period {
    const start = referenceDate.startOfWeek(this.startWeek);
    const end = referenceDate.endOfWeek(this.startWeek);
    return Period.build(start, end);
  }
  public genPeriod(referenceDate: LocalDate, cycle: 'weekly' | 'monthly' | 'yearly') {
    switch (cycle) {
      case 'weekly':
        return this.genWeekPeriod(referenceDate);
      case 'monthly':
        return this.genMonthPeriod(referenceDate);
      case 'yearly':
        return this.genYearPeriod(referenceDate);
      default:
        throw new NotImplementedError('period cycle', cycle);
    }
  }

  public calcNextPeriod(period: Period, cycle: 'weekly' | 'monthly' | 'yearly') {
    switch (cycle) {
      case 'weekly':
        return Period.build(period.end.addDays(1), period.end.addDays(7));
      case 'monthly':
        return this.genMonthPeriod(period.end.addDays(1));
      case 'yearly':
        return this.genYearPeriod(period.end.addDays(1));
      default:
        throw new NotImplementedError('period cycle', cycle);
    }
  }

  public genMonthPeriodYm(yearmonth: Yearmonth): Period {
    const nextYm = yearmonth.addMonths(1);
    const start = LocalDate.build(yearmonth.year, yearmonth.month, this.startMonth);
    const end = LocalDate.build(nextYm.year, nextYm.month, this.startMonth).addDays(-1);

    return Period.build(start, end);
  }
  public genYearmonth(referenceDate: LocalDate) {
    // monthlyPeriodのstartを取得
    const period = this.genMonthPeriod(referenceDate);
    return Yearmonth.build(period.start.year, period.start.month);
  }

  public updateStartYear(startYear: Month) {
    return new CycleStartDef(startYear, this.startMonth, this.startWeek);
  }

  public updateStartMonth(startMonth: Day) {
    return new CycleStartDef(this.startYear, startMonth, this.startWeek);
  }

  public updateStartWeek(startWeek: DayOfWeek) {
    return new CycleStartDef(this.startYear, this.startMonth, startWeek);
  }
}
export default CycleStartDef;
