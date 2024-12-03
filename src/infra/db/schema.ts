import { BudgetCycle, StrategyType } from '@/src/domain/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';
import { Day, DayOfWeek, Month } from '@/src/domain/valueobject/types';

export interface CategoryTable {
  id: string;
  name: string;
  iconName: IconName;
  iconColor: IconColor;
}

export interface CalendarTable {
  id: string;
  startYear: Month;
  startMonth: Day;
  startWeek: DayOfWeek;
}

export interface ExpenseTable {
  id: string;
  categoryId: string;
  amount: number;
  date: Date;
  memo: string;
}

export interface BudgetPlanTable {
  id: string;
  categoryId: string;
  strategyType: StrategyType;
}

export interface BudgetRegularyStrategyTable {
  budgetPlanId: string;
  amount: number;
  cycle: BudgetCycle;
  tempAmount?: number;
}

export interface Database {
  categories: CategoryTable;
  budgetPlans: BudgetPlanTable;
  budgetRegularyStrategies: BudgetRegularyStrategyTable;
  calendars: CalendarTable;
  expenses: ExpenseTable;
}
