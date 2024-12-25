import { buildActualCost } from '@/src/domain/projection/timeseries/daily/builder/actualCost';
import { ProjectedCostBuilder } from '@/src/domain/projection/timeseries/daily/builder/projectedCost';
import { DailyTimeSeries } from '@/src/domain/projection/timeseries/daily/timeseries';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import BudgetPlanService from '@/src/domain/service/BudgetPlanService';
import Yearmonth from '@/src/domain/valueobject/yearmonth';

export type CategorizedProjectedCost = {
  categoryId: string;
  cost: DailyTimeSeries;
};

export class MonthlyProjectionUsecase {
  private readonly repoRegistry;
  constructor() {
    this.repoRegistry = RepositoryRegistry.getInstance();
  }

  async loadEach(yearmonth: Yearmonth): Promise<CategorizedProjectedCost[]> {
    const { calendar, period, today, validBudgetPlans } = await this.getBaseData(yearmonth);

    const projectedCosts = await Promise.all(
      validBudgetPlans.map(async (bp) => {
        const projectedBuilder = new ProjectedCostBuilder(bp.categoryId, period, today, calendar, bp);
        const actual = await buildActualCost(
          [bp.categoryId],
          projectedBuilder.requiredPeriodOfActual,
          this.repoRegistry.expenseRepository,
        );
        const projected = projectedBuilder.build(actual);
        return { cost: projected, categoryId: bp.categoryId };
      }),
    );

    return projectedCosts.filter((pc): pc is CategorizedProjectedCost => pc !== undefined);
  }

  async loadAggregated(yearmonth: Yearmonth): Promise<DailyTimeSeries> {
    const { calendar, period, today, validBudgetPlans } = await this.getBaseData(yearmonth);

    const projectedCosts = await Promise.all(
      validBudgetPlans.map(async (bp) => {
        const projectedBuilder = new ProjectedCostBuilder(bp.categoryId, period, today, calendar, bp);
        const actual = await buildActualCost(
          [bp.categoryId],
          projectedBuilder.requiredPeriodOfActual,
          this.repoRegistry.expenseRepository,
        );
        const projected = projectedBuilder.build(actual);
        return { cost: projected, categoryId: bp.categoryId };
      }),
    );

    if (projectedCosts.length === 0) {
      return DailyTimeSeries.buildAllZero(period);
    } else {
      const onlyCosts = projectedCosts.map((pc) => pc.cost);
      const base = onlyCosts[0];
      const rest = onlyCosts.slice(1);
      base.aggregate(rest);
      return base;
    }
  }

  private async getBaseData(yearmonth: Yearmonth) {
    const [categories, budgetPlans, calendar] = await Promise.all([
      this.repoRegistry.categoryRepository.findAll(),
      this.repoRegistry.budgetPlanRepository.findAll(),
      this.repoRegistry.calendarRepository.findOne(),
    ]);
    const period = calendar.cycleStartDef.genMonthPeriodYm(yearmonth);
    const today = this.repoRegistry.todayRepository.getToday();
    const validBudgetPlans = BudgetPlanService.ensureValidBudgetPlans(budgetPlans, categories);
    return { categories, calendar, period, today, validBudgetPlans };
  }
}
