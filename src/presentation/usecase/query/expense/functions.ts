import Expense from '@/src/domain/aggregation/expense';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import LocalDate from '@/src/domain/valueobject/localdate';
import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { BaseError } from '@/src/utils/errors';

export const loadMonthlyExpenses = async (yearmonth: Yearmonth): Promise<Expense[]> => {
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const categoryRepository = RepositoryRegistry.getInstance().categoryRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;

  const [calendar, categories] = await Promise.all([calendarRepo.findOne(), categoryRepository.findAll()]);
  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);

  const start = new Date(period.start.year, period.start.month - 1, 1);
  const end = new Date(period.end.year, period.end.month, 0);
  const expenses = await expenseRepo.findSome(
    categories.map((c) => c.id),
    start,
    end,
  );

  return expenses;
};

export type MonthlyTimeline = { date: LocalDate; expenses: Expense[] }[];
export const loadMonthlyTimeline = async (yearmonth: Yearmonth, asc: boolean): Promise<MonthlyTimeline> => {
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const categoryRepository = RepositoryRegistry.getInstance().categoryRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;

  const [calendar, categories] = await Promise.all([calendarRepo.findOne(), categoryRepository.findAll()]);
  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);

  const start = new Date(period.start.year, period.start.month - 1, 1);
  const end = new Date(period.end.year, period.end.month, 0);
  const expenses = await expenseRepo.findSome(
    categories.map((c) => c.id),
    start,
    end,
  );

  const map = new Map<string, Expense[]>();
  expenses.forEach((e) => {
    const key = LocalDate.fromDate(e.date).toString();
    map.set(key, (map.get(key) || []).concat(e));
  });

  const result: { date: LocalDate; expenses: Expense[] }[] = [];
  period.genArray().forEach((d) => {
    if (map.has(d.toString())) {
      result.push({ date: d, expenses: map.get(d.toString())! });
    }
  });

  if (asc) {
    return result;
  } else {
    // 中身もreverseする
    return result.reverse().map((item) => ({
      date: item.date,
      expenses: item.expenses.reverse(),
    }));
  }
};

export const loadExpenseDetail = async (id: string): Promise<Expense> => {
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;
  const expense = await expenseRepo.find(id);
  if (!expense) {
    throw new BaseError('指定の支出が見つかりません', { context: { expense } });
  }
  return expense;
};
