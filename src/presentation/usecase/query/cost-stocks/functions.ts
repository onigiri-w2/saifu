import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import CostFlowFactory from '@/src/domain/projection/costflow/factory';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import Yearmonth from '@/src/domain/valueobject/yearmonth';
import { assert } from '@/src/utils/errors';

export type CostStock = {
  categoryId: string;
  stock: DailyStock;
};

export const loadMonthlyCostStocks = async (yearmonth: Yearmonth): Promise<CostStock[]> => {
  const categoryRepo = RepositoryRegistry.getInstance().categoryRepository;
  const budgetPlanRepository = RepositoryRegistry.getInstance().budgetPlanRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const expenseRepo = RepositoryRegistry.getInstance().expenseRepository;
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;

  const [categories, budgetPlans, calendar] = await Promise.all([
    categoryRepo.findAll(),
    budgetPlanRepository.findAll(),
    calendarRepo.findOne(),
  ]);

  const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);
  const today = todayRepo.getToday();
  const factory = new CostFlowFactory(expenseRepo);

  const validBudgetPlans = categories.map((c) => {
    const bp = budgetPlans.find((bp) => bp.categoryId === c.id);
    return bp ? bp : BudgetPlan.withNone(c.id);
  });

  return await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const f = await factory.forBudgeted(period, bp, calendar.cycleStartDef, today);
      const category = categories.find((c) => c.id === bp.categoryId);
      assert(category, 'categoryがないはずがありません');

      return { stock: f.flow.toStock(), categoryId: category.id };
    }),
  );
};
