import BudgetPlan from '@/src/domain/model/aggregation/budgetPlan';
import { BudgetCycle } from '@/src/domain/model/aggregation/budgetPlan/types';
import Calendar from '@/src/domain/model/aggregation/calendar';
import Today from '@/src/domain/aggregation/today';
import { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import CycleStartDef from '@/src/domain/model/valueobject/cycleStartDef';
import LocalDate from '@/src/domain/model/valueobject/localdate';
import Period from '@/src/domain/model/valueobject/period';
import { HashMap } from '@/src/utils/collections';

import { DailyTimeSeries } from '../timeseries';

import { ProjectedCostBuilder } from './projectedCostTrend';

describe('ProjectedCostBuilder.requiredPeriodOfActual', () => {
  describe('[予算が存在しない場合] => コンストラクタで指定された期間をそのまま返す', () => {
    test('this.budgets = []', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildNoneBudgetPlanHelper(),
      });
      expect(sut.requiredPeriodOfActual).toEqual(
        Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
      );
    });
  });
  describe('[予算が存在する場合] => コンストラクタで指定された期間と全予算の期間をマージした期間を返す', () => {
    test('budgetPlan: regular(weekly) = budgets: [2020-12-27-2021-02-06] => 2020-12-27-2021-02-06', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
      });
      expect(sut.requiredPeriodOfActual).toEqual(
        Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 2, 6)),
      );
    });
  });
});

describe('ProjectedCostBuilder.build', () => {
  describe('[actualの期間がrequie)redPeriodOfActualと一致しない場合] => エラー', () => {
    test('requiredPeriodOfActual: 2020-12-27 ~ 2021-01-02, actual: 2020-12-27 ~ 2021-1-1', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 1, 2)),
      });
      const actual = buildTimeSeriesHelper([1000, 1000, 1000, 1000, 1000, 1000], LocalDate.build(2020, 12, 27));
      expect(() => sut.build(actual)).toThrow();
    });
  });
  describe('[予算あり ^ 今日が予算期間に入ってる or 予算期間以前の場合] => 予算をactualに反映', () => {
    test('budgetPlan: regular(weekly) = budgets: [2020/12/27 ~ 2021/01/02], today = 2020-12-27', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 1, 2)),
        today: Today.build(LocalDate.build(2020, 12, 27)),
      });
      const actual = buildTimeSeriesHelper(
        Array.from({ length: 7 }, () => 0),
        LocalDate.build(2020, 12, 27),
      );
      expect(actual.calcSum()).toBe(0);
      const result = sut.build(actual);
      expect(result.calcSum()).not.toBe(0);
    });
    test('budgetPlan: regular(weekly) = budgets: [2020/12/27 ~ 2021/01/02], today = 2020-12-26', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 1, 2)),
        today: Today.build(LocalDate.build(2020, 12, 26)),
      });
      const actual = buildTimeSeriesHelper(
        Array.from({ length: 7 }, () => 0),
        LocalDate.build(2020, 12, 27),
      );
      expect(actual.calcSum()).toBe(0);
      const result = sut.build(actual);
      expect(result.calcSum()).not.toBe(0);
    });
    test('budgetPlan: regular(weekly) = budgets: [2020/12/27 ~ 2021/01/02], today = 2021/01/02', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 1, 2)),
        today: Today.build(LocalDate.build(2021, 1, 2)),
      });
      const actual = buildTimeSeriesHelper(
        Array.from({ length: 7 }, () => 0),
        LocalDate.build(2020, 12, 27),
      );
      expect(actual.calcSum()).toBe(0);
      const result = sut.build(actual);
      expect(result.calcSum()).not.toBe(0);
    });
  });
  describe('[予算あり ^ 今日が予算期間以降の場合] => 予算をactualに反映しない', () => {
    test('budgetPlan: regular(weekly) = budgets: [2020/12/27 ~ 2021/01/02], today = 2021-01-03', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 27), LocalDate.build(2021, 1, 2)),
        today: Today.build(LocalDate.build(2021, 1, 3)),
      });
      const actual = buildTimeSeriesHelper(
        Array.from({ length: 7 }, () => 0),
        LocalDate.build(2020, 12, 27),
      );
      expect(actual.calcSum()).toBe(0);
      const result = sut.build(actual);
      expect(result.calcSum()).toBe(0);
    });
  });
  describe('[予算期間と初期化時の期間が異なる場合] => 出力は初期化時の期間で切られる', () => {
    test('budgetPlan: regular(weekly) = budgets: [2020/12/27 ~ 2021/01/02], today = 2020-12-27, period = 2020-12-28 ~ 2021-01-01', () => {
      const sut = buildProjectedCostBuilderHelper({
        budgetPlan: buildRegularlyBudgetPlanHelper({ cycle: 'weekly', amount: 1000 }),
        period: Period.build(LocalDate.build(2020, 12, 28), LocalDate.build(2021, 1, 1)),
        today: Today.build(LocalDate.build(2020, 12, 27)),
      });
      const actual = buildTimeSeriesHelper(
        Array.from({ length: 7 }, () => 0),
        LocalDate.build(2020, 12, 27),
      );
      expect(actual.calcSum()).toBe(0);
      const result = sut.build(actual);
      expect(result.calcSum()).not.toBe(0);
      expect(result.getPeriod()).toEqual(Period.build(LocalDate.build(2020, 12, 28), LocalDate.build(2021, 1, 1)));
    });
  });
});

type BuildProjectedCostBuilderHelperParams = {
  categoryId?: string;
  period?: Period;
  today?: Today;
  calendar?: Calendar;
  budgetPlan?: BudgetPlan;
};
function buildProjectedCostBuilderHelper({
  categoryId = 'categoryId',
  period = Period.build(LocalDate.build(2021, 1, 1), LocalDate.build(2021, 1, 31)),
  today = Today.build(LocalDate.build(2021, 1, 1)),
  calendar = Calendar.buildOne(CycleStartDef.build(1, 1, 0)),
  budgetPlan = buildNoneBudgetPlanHelper({ categoryId }),
}: BuildProjectedCostBuilderHelperParams): ProjectedCostBuilder {
  return new ProjectedCostBuilder(TransactionCategoryId.build(categoryId), period, today, calendar, budgetPlan);
}

function buildTimeSeriesHelper(numbers: number[], startDate: LocalDate = LocalDate.build(2021, 1, 1)): DailyTimeSeries {
  const period = Period.build(startDate, startDate.addDays(numbers.length - 1));
  const entries = numbers.map((n, i) => [startDate.addDays(i), n] as [LocalDate, number]);
  const map = new HashMap<LocalDate, number>(entries);
  return DailyTimeSeries.fromMap(map, period);
}

function buildRegularlyBudgetPlanHelper({
  categoryId = 'categoryId',
  cycle = 'weekly',
  amount = 1000,
}: { categoryId?: string; cycle?: BudgetCycle; amount?: number } = {}) {
  return BudgetPlan.withRegularly(TransactionCategoryId.build(categoryId), cycle, amount);
}

function buildNoneBudgetPlanHelper({ categoryId = 'categoryId' }: { categoryId?: string } = {}) {
  return BudgetPlan.withNone(TransactionCategoryId.build(categoryId));
}
