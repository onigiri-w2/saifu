import { StrategyType, BudgetCycle } from '@/src/domain/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/types/categoryIconColor';
import { IconName } from '@/src/domain/types/categoryIconName';
import { Month, Day, DayOfWeek } from '@/src/domain/valueobject/types';

export interface ExpenseCategoryTable {
  id: string;
  name: string;
  iconName: IconName;
  iconColor: IconColor;
}

export interface IncomeCategoryTable {
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

export interface IncomeTable {
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
  tempAmount: number | null;
}
