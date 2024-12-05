import { proxy, subscribe } from 'valtio';
import { deepClone } from 'valtio/utils';

import { isRegularlyStrategy } from '@/src/domain/aggregation/budgetPlan/strategy/regularly';
import { BudgetCycle, StrategyType } from '@/src/domain/aggregation/budgetPlan/types';
import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';
import { BudgetingCategory } from '@/src/presentation/usecase/query/budgeting-category/functions';

export const createFormDataStore = (source?: BudgetingCategory) => {
  const initialState = createInitialState(source);

  const subscribers: Set<(isDirty: boolean, isValid: boolean) => void> = new Set();
  let tempAmountBuffer = 0;

  const formContext: FormContext = source
    ? ({
      mode: 'update',
      categoryId: source.category.id,
      budgetPlanId: source.budgetPlan.id,
    } as const)
    : ({
      mode: 'create',
      categoryId: undefined,
      budgetPlanId: undefined,
    } as const);

  const store = proxy<FormDataStore>({
    form: deepClone(initialState),

    isDirty() {
      return !isEqual(initialState, this.form);
    },
    isValid() {
      return validate(this.form);
    },
    subscribe(callback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    toggleTempAmount() {
      const nowTempAmount = this.form.budgetPlan.strategyInputs.regularly.tempAmount;

      if (nowTempAmount !== undefined) {
        tempAmountBuffer = nowTempAmount;
        this.form.budgetPlan.strategyInputs.regularly.tempAmount = undefined;
      } else {
        this.form.budgetPlan.strategyInputs.regularly.tempAmount = tempAmountBuffer;
      }
    },
    getContext() {
      return formContext;
    },
  });

  subscribe(store.form, () => {
    const isDirty = store.isDirty();
    const isValid = store.isValid();
    subscribers.forEach((callback) => {
      callback(isDirty, isValid);
    });
  });

  return store;
};

const createInitialState = (source?: BudgetingCategory): FormDataState => {
  if (!source) return deepClone(DEFAULT_STATE);

  const baseState: FormDataState = {
    categoryName: source.category.name,
    iconName: source.category.iconName,
    iconColor: source.category.iconColor,
    budgetPlan: {
      selectedStrategyType: 'none',
      strategyInputs: DEFAULT_STATE.budgetPlan.strategyInputs,
    },
  };

  const strategy = source.budgetPlan.strategy;
  if (isRegularlyStrategy(strategy)) {
    baseState.budgetPlan.selectedStrategyType = 'regularly';
    baseState.budgetPlan.strategyInputs = {
      regularly: {
        amount: strategy.amount.value,
        cycle: strategy.cycle,
        tempAmount: strategy.tempAmount?.value,
      },
    };
  }

  return baseState;
};

const isEqual = (a: FormDataState, b: FormDataState): boolean => {
  // 基本フィールドの比較
  if (
    a.categoryName !== b.categoryName ||
    a.iconName !== b.iconName ||
    a.iconColor !== b.iconColor ||
    a.budgetPlan.selectedStrategyType !== b.budgetPlan.selectedStrategyType
  ) {
    return false;
  }

  // strategyTypeがregularlyの場合のpayloadsの比較;
  if (a.budgetPlan.selectedStrategyType === 'regularly') {
    const aPayload = a.budgetPlan.strategyInputs.regularly;
    const bPayload = b.budgetPlan.strategyInputs.regularly;

    return (
      aPayload.amount === bPayload.amount &&
      aPayload.cycle === bPayload.cycle &&
      ((!aPayload.tempAmount && !bPayload.tempAmount) || // 両方undefinedの場合
        aPayload.tempAmount === bPayload.tempAmount) // 両方に値がある場合の比較
    );
  }

  // strategyTypeがregularly以外の場合は、
  // 基本フィールドの比較だけで十分なのでtrueを返す
  return true;
};

const validate = (form: FormDataState): boolean => {
  if (!form.categoryName) return false;
  return true;
};

export type FormDataState = {
  categoryName: string;
  iconName: IconName;
  iconColor: IconColor;
  budgetPlan: {
    selectedStrategyType: StrategyType;
    strategyInputs: {
      regularly: {
        amount: number;
        cycle: BudgetCycle;
        tempAmount?: number;
      };
    };
  };
};
export type FormContext =
  | { mode: 'create'; categoryId: undefined; budgetPlanId: undefined }
  | { mode: 'update'; categoryId: string; budgetPlanId: string };
export type FormDataStore = {
  form: FormDataState;
  subscribe: (callback: (isDirty: boolean, isValid: boolean) => void) => void;
  isDirty: () => boolean;
  isValid: () => boolean;
  toggleTempAmount: () => void;
  getContext: () => FormContext;
};
const DEFAULT_STATE: FormDataState = {
  categoryName: '',
  iconName: 'fork',
  iconColor: '#E53E3E',
  budgetPlan: {
    selectedStrategyType: 'none',
    strategyInputs: {
      regularly: {
        amount: 0,
        cycle: 'monthly',
        tempAmount: undefined,
      },
    },
  },
} as const;
