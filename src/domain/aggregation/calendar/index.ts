import { Day, DayOfWeek, Month } from '@/src/domain/valueobject/types';

import CycleStartDef from '../../valueobject/cycleStartDef';

export const ONE_ID = 'just_one';
class Calendar {
  private constructor(
    public readonly id: string,
    public readonly cycleStartDef: CycleStartDef,
  ) { }

  static buildOne(cycleStartDef: CycleStartDef) {
    return new Calendar(ONE_ID, cycleStartDef);
  }

  static create(cycleStartDef: CycleStartDef) {
    const id = ONE_ID;
    return new Calendar(id, cycleStartDef);
  }

  updateStartYear(startYear: Month) {
    return new Calendar(this.id, this.cycleStartDef.updateStartYear(startYear));
  }

  updateStartMonth(startMonth: Day) {
    return new Calendar(this.id, this.cycleStartDef.updateStartMonth(startMonth));
  }

  updateStartWeek(startWeek: DayOfWeek) {
    return new Calendar(this.id, this.cycleStartDef.updateStartWeek(startWeek));
  }
}
export default Calendar;
