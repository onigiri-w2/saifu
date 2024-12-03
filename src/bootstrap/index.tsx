import RepositoryRegistry from '../domain/repositoryRegistry';
import { migrator } from '../infra/db/migrator';
import DbBudgetPlanRepository from '../infra/db/repository/budgetPlanRepository';
import DbCalendarRepository from '../infra/db/repository/calendarRepository';
import DbCategoryRepository from '../infra/db/repository/categoryRepository';
import DbExpenseRepository from '../infra/db/repository/expenseRepository';
import { seedDevelopmentData } from '../infra/db/seed/seed.dev';
import MemoryTodayRepository from '../infra/memory/repository/todayRepository';

export const bootstrap = async () => {
  await initializeDataLayer();
};

const initializeDataLayer = async () => {
  // Repositoryの初期化
  RepositoryRegistry.initialize(
    new DbBudgetPlanRepository(),
    new DbCalendarRepository(),
    new DbCategoryRepository(),
    new DbExpenseRepository(),
    new MemoryTodayRepository(),
  );
  // DBの初期化
  await migrator.migrateToLatest();
  if (__DEV__) {
    await seedDevelopmentData();
  }
};
