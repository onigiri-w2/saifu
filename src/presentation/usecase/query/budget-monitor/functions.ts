import BudgetMonitorFactory from '@/src/domain/projection/budgetMonitor/factory';
import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export const loadThisCycleMonitors = async (): Promise<ThisCycleMonitor[]> => {
  const budgetPlanRepo = RepositoryRegistry.getInstance().budgetPlanRepository;
  const calendarRepo = RepositoryRegistry.getInstance().calendarRepository;
  const todayRepo = RepositoryRegistry.getInstance().todayRepository;
  const expneseRepo = RepositoryRegistry.getInstance().expenseRepository;

  const budgetMontiorFactory = new BudgetMonitorFactory(expneseRepo);

  const [budgetPlans, calendar] = await Promise.all([budgetPlanRepo.findAll(), calendarRepo.findOne()]);
  const today = todayRepo.getToday();

  const monitors = await Promise.all(
    budgetPlans.map(async (budgetPlan) => {
      return await budgetMontiorFactory.forThisCycle(budgetPlan, today, calendar.cycleStartDef);
    }),
  );

  return monitors.filter((m) => m !== undefined) as ThisCycleMonitor[];
};
