import BudgetPlan from '@/src/domain/model/aggregation/budgetPlan';
import TransactionCategory from '@/src/domain/model/aggregation/transactionCategory';

export type ExtendedCategory = {
  category: TransactionCategory;
  budgetPlan: BudgetPlan | undefined;
};
