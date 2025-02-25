import Calendar from '@/src/domain/model/aggregation/calendar';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

import { UpdateRequest } from './types';

export async function updateCalendar(request: UpdateRequest): Promise<Calendar> {
  const repo = RepositoryRegistry.getInstance().calendarRepository;

  const newCalendar = Calendar.buildOne(request.cycleStartDef);

  await repo.save(newCalendar);
  return newCalendar;
}
