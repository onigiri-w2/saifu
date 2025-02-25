import { BudgetCycle } from '@/src/domain/model/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/model/types/categoryIconColor';
import { IconName } from '@/src/domain/model/types/categoryIconName';

// リクエスト型の定義
export type AddRequest = {
  category: CategoryBase;
  budgetPlan: BudgetPlanBase;
};

export type UpdateRequest = {
  category: WithId<CategoryBase>;
  budgetPlan: WithId<BudgetPlanBase>;
};

// 共通の基本型定義
export type CategoryBase = {
  name: string;
  iconName: IconName;
  iconColor: IconColor;
};

export type BudgetStrategyBase =
  | {
    type: 'regularly';
    cycle: BudgetCycle;
    amount: number;
    tempAmount?: number;
  }
  | {
    type: 'none';
  };

export type BudgetPlanBase = {
  strategy: BudgetStrategyBase;
};

// ID付きの拡張型
export type WithId<T> = T & {
  id: string;
};
