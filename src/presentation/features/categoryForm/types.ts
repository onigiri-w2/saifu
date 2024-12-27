import { BudgetCycle, StrategyType } from '@/src/domain/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/types/categoryIconColor';
import { IconName } from '@/src/domain/types/categoryIconName';

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
