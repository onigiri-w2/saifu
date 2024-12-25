import Calendar from '@/src/domain/aggregation/calendar';
import Today from '@/src/domain/aggregation/today';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Yearmonth from '@/src/domain/valueobject/yearmonth';

export const loadCalendar = async (): Promise<Calendar> => {
  const repo = RepositoryRegistry.getInstance().calendarRepository;
  return await repo.findOne();
};

type CalendarCurrentInfoResponse = {
  today: Today;
  yearmonth: Yearmonth;
};
export const loadCurrentInfo = async (): Promise<CalendarCurrentInfoResponse> => {
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;

  const today = todayRepo.getToday();
  const calendar = await calendarRepo.findOne();
  const yearmonth = calendar.cycleStartDef.genYearmonth(today.date);

  return { today, yearmonth };
};
