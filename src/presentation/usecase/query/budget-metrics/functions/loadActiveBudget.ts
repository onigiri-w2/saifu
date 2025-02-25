import buildActiveBudgetMetrics from '@/src/domain/model/projection/budgetMetrics/activeBudget/builder';
import { ActiveBudgetMetrics } from '@/src/domain/model/projection/budgetMetrics/activeBudget/metrics';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import BudgetPlanService from '@/src/domain/service/BudgetPlanService';

export async function loadAllActiveBudgetMetrics(): Promise<ActiveBudgetMetrics[]> {
  const budgetPlanRepo = RepositoryRegistry.getInstance().budgetPlanRepository;
  const categoryRepository = RepositoryRegistry.getInstance().transactionCategoryRepository;
  const transactionRepository = RepositoryRegistry.getInstance().transactionRepository;
  const calendarRepository = RepositoryRegistry.getInstance().calendarRepository;

  const [validBudgetPlans, calendar] = await Promise.all([
    new BudgetPlanService(budgetPlanRepo).loadValidBudgetPlans(categoryRepository),
    calendarRepository.findOne(),
  ]);

  const budgetMetrics = await Promise.all(
    validBudgetPlans.map(async (bp) => {
      const metrics = await buildActiveBudgetMetrics(bp, calendar, transactionRepository);
      return metrics;
    }),
  );
  return budgetMetrics.filter((m): m is ActiveBudgetMetrics => m !== undefined);
}
