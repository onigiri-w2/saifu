import {
  BudgetPlanTable,
  BudgetRegularyStrategyTable,
  CalendarTable,
  TransactionCategoryTable,
  TransactionTable,
} from './tables';

export interface Schema {
  budgetPlans: BudgetPlanTable;
  budgetRegularyStrategies: BudgetRegularyStrategyTable;
  calendars: CalendarTable;
  transactions: TransactionTable;
  transactionCategories: TransactionCategoryTable;
}
