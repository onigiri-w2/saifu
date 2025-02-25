import { StrategyType, BudgetCycle } from '@/src/domain/model/aggregation/budgetPlan/types';
import { TransactionType } from '@/src/domain/model/aggregation/transaction';
import { TransactionCategoryType } from '@/src/domain/model/aggregation/transactionCategory';
import { IconColor } from '@/src/domain/model/types/categoryIconColor';
import { IconName } from '@/src/domain/model/types/categoryIconName';
import { Month, Day, DayOfWeek } from '@/src/domain/model/valueobject/types';

export interface CalendarTable {
  id: string;
  startYear: Month;
  startMonth: Day;
  startWeek: DayOfWeek;
}

export interface TransactionTable {
  id: string;
  categoryId: string;
  amount: number;
  date: Date;
  memo: string;
  type: TransactionType;
}

export interface TransactionCategoryTable {
  id: string;
  name: string;
  iconName: IconName;
  iconColor: IconColor;
  type: TransactionCategoryType;
}

export interface BudgetPlanTable {
  id: string;
  categoryIds: string;
  strategyType: StrategyType;
}

export interface BudgetRegularyStrategyTable {
  budgetPlanId: string;
  amount: number;
  cycle: BudgetCycle;
  tempAmount: number | null;
}
