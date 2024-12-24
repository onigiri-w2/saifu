import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import { buildBudgetsInPeriod } from '@/src/domain/projection/budget';
import { createProjectedCost } from '@/src/domain/projection/timeseries/daily/factory/projectedCost';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Period from '@/src/domain/valueobject/period';
import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { assert } from '@/src/utils/errors';

export type CostStock = {
  period: Period;
  points: ReturnType<DailyTimeSeries['asStock']>;
};

export type CategorizedCostStock = {
  categoryId: string;
  stock: CostStock;
};

export const loadMonthlyTimeSeries = async (yearmonth: Yearmonth): Promise<CategorizedCostStock[]> => {
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

  const validBudgetPlans = categories.map((c) => {
    const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
    return bp ? bp : BudgetPlan.withNone(c.id);
  });

  return await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const budgets = buildBudgetsInPeriod(bp, calendar.cycleStartDef, today, period);
      const timeseries = await createProjectedCost(bp.categoryId, period, budgets, today, expenseRepo);
      const category = categories.find((c) => c.id === bp.categoryId);
      assert(category, 'categoryがないはずがありません');

      return {
        stock: {
          period: timeseries.getPeriod(),
          points: timeseries.asStock(),
        },
        categoryId: category.id,
      };
    }),
  );
};

export const loadMonthlyAggregatedStock = async (yearmonth: Yearmonth): Promise<CostStock> => {
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

  const validBudgetPlans = categories.map((c) => {
    const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
    return bp ? bp : BudgetPlan.withNone(c.id);
  });

  const stocks = await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const budgets = buildBudgetsInPeriod(bp, calendar.cycleStartDef, today, period);
      const s = await createProjectedCost(bp.categoryId, period, budgets, today, expenseRepo);
      const category = categories.find((c) => c.id === bp.categoryId);
      assert(category, 'categoryがないはずがありません');
      return s;
    }),
  );

  if (stocks.length === 0) {
    const ts = DailyTimeSeries.buildAllZero(period);
    return { period, points: ts.asStock() };
  } else {
    const base = stocks[0];
    const rest = stocks.slice(1);
    base.aggregate(rest);
    return { period, points: base.asStock() };
  }
};
