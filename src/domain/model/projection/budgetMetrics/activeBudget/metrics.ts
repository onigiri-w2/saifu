export interface ActiveBudgetMetrics {
  budgetPlanId: string;
  categoryIds: string[];
  data: {
    period: {
      money: {
        budget: number; // 期間の予算総額
        spending: number; // 期間の支出総額
        paceDeviation: number; // 理想の使用ペーストの差分
      };
      days: {
        total: number; // 予算期間の総日数
        remaining: number; // 残り日数
      };
    };
    today: {
      money: {
        budget: number; // 今日の予算額
        spending: number; // 今日の支出額
      };
    };
  };
}
