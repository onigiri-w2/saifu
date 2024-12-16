import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import {
  ActualCostFactory,
  ForecastCostFactory,
  ProjectedCostFactory,
} from '@/src/domain/projection/timeseries/daily/factory';
import { DailyProjectedCostStock } from '@/src/domain/projection/timeseries/daily/timeseries';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { assert } from '@/src/utils/errors';

export type CostStock = {
  categoryId: string;
  stock: DailyProjectedCostStock;
};

export const loadMonthlyStocks = async (yearmonth: Yearmonth): Promise<CostStock[]> => {
  const categoryRepo = RepositoryRegistry.getInstance().categoryRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;
  const budgetPlanRepo = RepositoryRegistry.getInstance().budgetPlanRepository;
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;

  const [categories, budgetPlans, calendar] = await Promise.all([
    categoryRepo.findAll(),
    budgetPlanRepo.findAll(),
    calendarRepo.findOne(),
  ]);

  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);
  const today = todayRepo.getToday();

  const actualFactory = new ActualCostFactory(expenseRepo);
  const forecastFactory = new ForecastCostFactory(expenseRepo, calendar);
  const projectedFactory = new ProjectedCostFactory(actualFactory, forecastFactory);

  const validBudgetPlans = categories.map((c) => {
    const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
    return bp ? bp : BudgetPlan.withNone(c.id);
  });

  return await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const s = await projectedFactory.generateStock(period, bp, today);
      const category = categories.find((c) => c.id === bp.categoryId);
      assert(category, 'categoryがないはずがありません');

      return { stock: s, categoryId: category.id };
    }),
  );
};

export const loadMonthlyAggregatedStock = async (yearmonth: Yearmonth): Promise<DailyProjectedCostStock> => {
  const categoryRepo = RepositoryRegistry.getInstance().categoryRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;
  const budgetPlanRepo = RepositoryRegistry.getInstance().budgetPlanRepository;
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;

  const [categories, budgetPlans, calendar] = await Promise.all([
    categoryRepo.findAll(),
    budgetPlanRepo.findAll(),
    calendarRepo.findOne(),
  ]);

  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);
  const today = todayRepo.getToday();

  const actualFactory = new ActualCostFactory(expenseRepo);
  const forecastFactory = new ForecastCostFactory(expenseRepo, calendar);
  const projectedFactory = new ProjectedCostFactory(actualFactory, forecastFactory);

  const validBudgetPlans = categories.map((c) => {
    const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
    return bp ? bp : BudgetPlan.withNone(c.id);
  });

  const stocks = await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const s = await projectedFactory.generateStock(period, bp, today);
      const category = categories.find((c) => c.id === bp.categoryId);
      assert(category, 'categoryがないはずがありません');
      return s;
    }),
  );

  if (stocks.length === 0) {
    return DailyProjectedCostStock.buildAllZero(period);
  } else {
    const first = stocks[0];
    const rest = stocks.slice(1);
    return first.aggregate(rest);
  }
};
