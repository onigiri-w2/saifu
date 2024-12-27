import {
  ExpenseCategoryTable,
  IncomeCategoryTable,
  BudgetPlanTable,
  BudgetRegularyStrategyTable,
  CalendarTable,
  ExpenseTable,
  IncomeTable,
} from './tables';

export interface Schema {
  expenseCategories: ExpenseCategoryTable;
  incomeCategories: IncomeCategoryTable;
  budgetPlans: BudgetPlanTable;
  budgetRegularyStrategies: BudgetRegularyStrategyTable;
  calendars: CalendarTable;
  expenses: ExpenseTable;
  incomes: IncomeTable;
}
