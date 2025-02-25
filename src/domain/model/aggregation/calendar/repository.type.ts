import Calendar from '.';

interface ICalendarRepository {
  save: (entity: Calendar) => Promise<void>;
  findOne: () => Promise<Calendar>;
}

export default ICalendarRepository;
