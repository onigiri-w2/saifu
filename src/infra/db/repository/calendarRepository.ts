import Calendar from '@/src/domain/aggregation/calendar';
import ICalendarRepository from '@/src/domain/aggregation/calendar/repository.type';
import { CalendarRepositoryError } from '@/src/domain/error';
import CycleStartDef from '@/src/domain/valueobject/cycleStartDef';
import { assert } from '@/src/utils/errors';

import { db } from '../client';

class DbCalendarRepository implements ICalendarRepository {
  async save(entity: Calendar): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        await transaction.deleteFrom('calendars').where('id', '=', entity.id).execute();
        await transaction
          .insertInto('calendars')
          .values({
            id: entity.id,
            startYear: entity.cycleStartDef.startYear,
            startMonth: entity.cycleStartDef.startMonth,
            startWeek: entity.cycleStartDef.startWeek,
          })
          .execute();
      });
    } catch (e) {
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
      return Calendar.buildOne(CycleStartDef.build(calendar.startYear, calendar.startMonth, calendar.startWeek));
    } catch (e) {
      throw new CalendarRepositoryError('カレンダーの取得に失敗しました', {
        cause: e,
      });
    }
  }
}
export default DbCalendarRepository;
