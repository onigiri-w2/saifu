import Money from '../../valueobject/money';

const STRATEGY_TYPES = { REGULARLY: 'regularly' } as const;
export type StrategyType = (typeof STRATEGY_TYPES)[keyof typeof STRATEGY_TYPES];
export interface BaseStrategy<T> {
  type: StrategyType;
  equals(other: T): boolean;
}
export interface IBudgetRegularlyStrategy extends BaseStrategy<IBudgetRegularlyStrategy> {
  type: typeof STRATEGY_TYPES.REGULARLY;
  amount: Money;
  cycle: BudgetCycle;
  tempAmount?: Money;
}
export type Strategy = IBudgetRegularlyStrategy;

export const budgetCycles = ['weekly', 'monthly', 'yearly'] as const;
export type BudgetCycle = (typeof budgetCycles)[number];
export const isBudgetCycle = (value: unknown): value is BudgetCycle => {
  return budgetCycles.includes(value as any);
};

export const budgetCycleLabels = {
  monthly: '月',
  weekly: '週',
  yearly: '年',
};
