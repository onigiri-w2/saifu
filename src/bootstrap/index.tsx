import RepositoryRegistry from '../domain/repositoryRegistry';
import { migrator } from '../infra/db/migrator';
import DbBudgetPlanRepository from '../infra/db/repository/budgetPlanRepository';
import DbCalendarRepository from '../infra/db/repository/calendarRepository';
import DbTransactionCategoryRepository from '../infra/db/repository/transactionCategoryRepository';
import DbTransactionRepository from '../infra/db/repository/transactionRepository';
import { seedDevelopmentData } from '../infra/db/seed/seed.dev';

export const bootstrap = async () => {
  await initializeDataLayer();
};

const initializeDataLayer = async () => {
  // Repositoryの初期化
  RepositoryRegistry.initialize(
    new DbBudgetPlanRepository(),
    new DbCalendarRepository(),
    new DbTransactionRepository(),
    new DbTransactionCategoryRepository(),
  );
  // DBの初期化
  await migrator.migrateToLatest();
  if (__DEV__) {
    await seedDevelopmentData();
  }
};
