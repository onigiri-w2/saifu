import { Day, DayOfWeek, Month } from '@/src/domain/model/valueobject/types';

import CycleStartDef from '../../valueobject/cycleStartDef';
import Today from '../../valueobject/today';

export const ONE_ID = 'just_one';

class Calendar {
  private constructor(
    public readonly id: string,
    public readonly cycleStartDef: CycleStartDef,
    public today: Today,
  ) { }

  static buildOne(cycleStartDef: CycleStartDef, today: Today) {
    return new Calendar(ONE_ID, cycleStartDef, today);
  }

  static create(cycleStartDef: CycleStartDef, today: Today) {
    const id = ONE_ID;
    return new Calendar(id, cycleStartDef, today);
  }

  updateStartYear(startYear: Month) {
    return new Calendar(this.id, this.cycleStartDef.updateStartYear(startYear), this.today);
  }

  updateStartMonth(startMonth: Day) {
    return new Calendar(this.id, this.cycleStartDef.updateStartMonth(startMonth), this.today);
  }

  updateStartWeek(startWeek: DayOfWeek) {
    return new Calendar(this.id, this.cycleStartDef.updateStartWeek(startWeek), this.today);
  }
}
export default Calendar;
