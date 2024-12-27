import RepositoryRegistry from '../domain/repositoryRegistry';
import { migrator } from '../infra/db/migrator';
import DbBudgetPlanRepository from '../infra/db/repository/budgetPlanRepository';
import DbCalendarRepository from '../infra/db/repository/calendarRepository';
import DbExpenseCategoryRepository from '../infra/db/repository/expenseCategoryRepository';
import DbExpenseRepository from '../infra/db/repository/expenseRepository';
import DbIncomeCategoryRepository from '../infra/db/repository/incomeCategoryRepository';
import DbIncomeRepository from '../infra/db/repository/incomeRepository';
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
    new DbExpenseCategoryRepository(),
    new DbIncomeCategoryRepository(),
    new DbExpenseRepository(),
    new DbIncomeRepository(),
    new MemoryTodayRepository(),
  );
  // DBの初期化
  await migrator.migrateToLatest();
  if (__DEV__) {
    await seedDevelopmentData();
  }
};
