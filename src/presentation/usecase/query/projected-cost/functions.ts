import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import { buildActualCost } from '@/src/domain/projection/timeseries/daily/builder/actualCost';
import { ProjectedCostBuilder } from '@/src/domain/projection/timeseries/daily/builder/projectedCost';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Yearmonth from '@/src/domain/valueobject/yearmonth';

export type CategorizedProjectedCost = {
  categoryId: string;
  cost: DailyTimeSeries;
};

export const loadMonthlyTimeSeries = async (yearmonth: Yearmonth): Promise<CategorizedProjectedCost[]> => {
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

  const projectedCosts = await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const category = categories.find((c) => c.id === bp.categoryId);
      if (!category) return undefined;

      const projectedBuilder = new ProjectedCostBuilder(bp.categoryId, period, today, calendar, bp);
      const actual = await buildActualCost([bp.categoryId], projectedBuilder.requiredPeriodOfActual, expenseRepo);
      const projected = projectedBuilder.build(actual);
      return { cost: projected, categoryId: category.id };
    }),
  );

  return projectedCosts.filter((pc): pc is CategorizedProjectedCost => pc !== undefined);
};

export const loadMonthlyAggregatedTimeSeries = async (yearmonth: Yearmonth): Promise<DailyTimeSeries> => {
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

  const costs = await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const category = categories.find((c) => c.id === bp.categoryId);
      if (!category) return undefined;

      const projectedBuilder = new ProjectedCostBuilder(bp.categoryId, period, today, calendar, bp);
      const actual = await buildActualCost([bp.categoryId], projectedBuilder.requiredPeriodOfActual, expenseRepo);
      return projectedBuilder.build(actual);
    }),
  );
  const validCosts = costs.filter((c): c is DailyTimeSeries => c !== undefined);

  if (validCosts.length === 0) {
    return DailyTimeSeries.buildAllZero(period);
  } else {
    const base = validCosts[0];
    const rest = validCosts.slice(1);
    base.aggregate(rest);
    return base;
  }
};
