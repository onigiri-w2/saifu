import { BudgetCycle, StrategyType } from '@/src/domain/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';

type RegularlyBudgetStrategyForm = {
  amount: number;
  cycle: BudgetCycle;
  tempAmount?: number;
};

export type FormState = {
  categoryId: string | undefined;
  categoryName: string;
  iconName: IconName;
  iconColor: IconColor;
  strategyType: StrategyType;
  strategyPaloads: {
    regularly: RegularlyBudgetStrategyForm;
  };
};
export type SelectedItem = 'strategy/regularly/amount' | 'strategy/regularly/cycle' | 'strategy/regularly/tempAmount';

export type CategoryBudgetFormRef = {
  save: () => boolean;
};
