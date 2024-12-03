import Calendar from '@/src/domain/aggregation/calendar';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export const loadCalendar = async (): Promise<Calendar> => {
  const repo = RepositoryRegistry.getInstance().calendarRepository;
  return await repo.findOne();
};
