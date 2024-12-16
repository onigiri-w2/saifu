import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import Calendar from '@/src/domain/aggregation/calendar';
import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import Today from '@/src/domain/aggregation/today';
import LocalDate from '@/src/domain/valueobject/localdate';
import Period from '@/src/domain/valueobject/period';

import { buildBudgetsInPeriod } from '../../budget';

import { DailyActualCostStock, DailyForecastCostStock, DailyProjectedCostStock } from './timeseries';

export class ActualCostFactory {
  constructor(private expenseRepository: IExpenseRepository) { }

  async generateStock(period: Period, categoryId: string): Promise<DailyActualCostStock> {
    const start = period.start.datetime;
    const end = new Date(period.end.datetime.getTime() - 1);
    const expenses = await this.expenseRepository.findSome([categoryId], start, end);
    return DailyActualCostStock.build(expenses, period);
  }

  async generateAggregatedStock(period: Period, categoryIds: string[]): Promise<DailyActualCostStock> {
    const start = period.start.datetime;
    const end = new Date(period.end.datetime.getTime() - 1);

    const expenses = await this.expenseRepository.findSome(categoryIds, start, end);
    return DailyActualCostStock.build(expenses, period);
  }
}

export class ForecastCostFactory {
  constructor(
    private expenseRepository: IExpenseRepository,
    private calendar: Calendar,
  ) { }

  async generateStock(
    requestedPeriod: Period,
    budgetPlan: BudgetPlan,
    today: Today,
  ): Promise<DailyForecastCostStock | undefined> {
    const cycleStartDef = this.calendar.cycleStartDef;
    const budgets = buildBudgetsInPeriod(budgetPlan, cycleStartDef, today, requestedPeriod);

    // budgetsが空の場合は、requestedPeriodをそのまま使う
    const periodForSearch =
      budgets.length === 0
        ? requestedPeriod
        : (Period.merge(budgets.map((budget) => budget.period)) ?? requestedPeriod);

    const startDatetime = LocalDate.min([periodForSearch.start, requestedPeriod.start]).datetime;
    const end = LocalDate.max([periodForSearch.end, requestedPeriod.end]);
    const endDatetime = new Date(end.datetime.getTime() - 1);

    const expenses = await this.expenseRepository.findSome([budgetPlan.categoryId], startDatetime, endDatetime);

    return DailyForecastCostStock.build(budgets, expenses, requestedPeriod, today);
  }
}

export class ProjectedCostFactory {
  constructor(
    private actualCostFactory: ActualCostFactory,
    private forecastCostFactory: ForecastCostFactory,
  ) { }

  async generateStock(period: Period, budgetPlan: BudgetPlan, today: Today): Promise<DailyProjectedCostStock> {
    const [actual, forecast] = await Promise.all([
      this.actualCostFactory.generateStock(period, budgetPlan.categoryId),
      this.forecastCostFactory.generateStock(period, budgetPlan, today),
    ]);

    return DailyProjectedCostStock.build(actual, forecast);
  }
}
