import { CalendarRepositoryError } from '@/src/domain/error';
import Calendar from '@/src/domain/model/aggregation/calendar';
import ICalendarRepository from '@/src/domain/model/aggregation/calendar/repository.type';
import CycleStartDef from '@/src/domain/model/valueobject/cycleStartDef';
import LocalDate from '@/src/domain/model/valueobject/localdate';
import Today from '@/src/domain/model/valueobject/today';
import { assert } from '@/src/utils/errors';

import { db } from '../client';

const TABLE_NAME = 'calendars';
class DbCalendarRepository implements ICalendarRepository {
  private today: Today;
  constructor() {
    this.today = new Today(LocalDate.fromDate(new Date()));
  }
  async save(entity: Calendar): Promise<void> {
    const prevToday = new Today(this.today.date);
    try {
      await db.transaction().execute(async (transaction) => {
        await transaction.deleteFrom(TABLE_NAME).where('id', '=', entity.id).execute();
        await transaction
          .insertInto(TABLE_NAME)
          .values({
            id: entity.id,
            startYear: entity.cycleStartDef.startYear,
            startMonth: entity.cycleStartDef.startMonth,
            startWeek: entity.cycleStartDef.startWeek,
          })
          .execute();
      });
      this.today = entity.today;
    } catch (e) {
      this.today = prevToday;
      throw new CalendarRepositoryError('カレンダーの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }
  async findOne(): Promise<Calendar> {
    try {
      const calendar = await db.selectFrom('calendars').selectAll().executeTakeFirst();
      assert(calendar, 'calendarが見つかりませんでした');
      return Calendar.buildOne(
        CycleStartDef.build(calendar.startYear, calendar.startMonth, calendar.startWeek),
        this.today,
      );
    } catch (e) {
      throw new CalendarRepositoryError('カレンダーの取得に失敗しました', {
        cause: e,
      });
    }
  }
}
export default DbCalendarRepository;
