import Expense from '@/src/domain/aggregation/expense';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Yearmonth from '@/src/domain/valueobject/yearmonth';

export const loadMonthlyExpenses = async (yearmonth: Yearmonth): Promise<Expense[]> => {
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;

  const calendar = await calendarRepo.findOne();
  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);

  const start = new Date(period.start.year, period.start.month - 1, 1);
  const end = new Date(period.end.year, period.end.month, 0);
  const expenses = await expenseRepo.findSome(undefined, start, end);

  return expenses;
};
