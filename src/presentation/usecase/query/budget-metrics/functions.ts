import buildActiveBudget from '@/src/domain/projection/budgetMetrics/activeBudget/builder';
import { ActiveBudgetMetrics } from '@/src/domain/projection/budgetMetrics/activeBudget/metrics';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export type CategorizedActiveBudgetMetrics = {
  categoryId: string;
  metrics: ActiveBudgetMetrics;
};

export const loadAllActiveBudgetMetrics = async (): Promise<CategorizedActiveBudgetMetrics[]> => {
  const budgetPlanRepo = RepositoryRegistry.getInstance().budgetPlanRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;
  const expneseRepo = RepositoryRegistry.getInstance().expenseRepository;

  const [budgetPlans, calendar] = await Promise.all([budgetPlanRepo.findAll(), calendarRepo.findOne()]);
  const today = todayRepo.getToday();

  const allMetrics = await Promise.all(
    budgetPlans.map(async (bp) => {
      const start = performance.now();
      const metrics = await buildActiveBudget(bp, calendar, today, expneseRepo);
      if (metrics === undefined) return undefined;
      const end = performance.now();
      console.log(`makeActiveBudget: ${end - start}ms`);
      return { categoryId: bp.categoryId, metrics };
    }),
  );

  return allMetrics.filter((metrics): metrics is CategorizedActiveBudgetMetrics => metrics !== undefined);
};
