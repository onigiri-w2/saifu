import { assert } from '../utils/errors';

import IBudgetPlanRepository from './aggregation/budgetPlan/repository.type';
import ICalendarRepository from './aggregation/calendar/repository.type';
import ICategoryRepository from './aggregation/category/repository.type';
import IExpenseRepository from './aggregation/expense/repository.type';
import ITodayRepository from './aggregation/today/repository.type';

// NOTE: このファイルのあるべき位置が不明。とりあえずdomain層に置いてる...

class RepositoryRegistry {
  private static instance: RepositoryRegistry | null = null;

  readonly budgetPlanRepository!: IBudgetPlanRepository;
  readonly calendarRepository!: ICalendarRepository;
  readonly categoryRepository!: ICategoryRepository;
  readonly expenseRepository!: IExpenseRepository;
  readonly todayRepository!: ITodayRepository;

  private constructor(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    categoryRepository: ICategoryRepository,
    expenseRepository: IExpenseRepository,
    todayRepository: ITodayRepository,
  ) {
    this.budgetPlanRepository = budgetPlanRepository;
    this.calendarRepository = calendarRepository;
    this.categoryRepository = categoryRepository;
    this.expenseRepository = expenseRepository;
    this.todayRepository = todayRepository;
  }

  static getInstance(): RepositoryRegistry {
    assert(this.instance, 'RepositoryRegistryが初期化されていません');
    return this.instance;
  }

  static initialize(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    categoryRepository: ICategoryRepository,
    expenseRepository: IExpenseRepository,
    todayRepository: ITodayRepository,
  ) {
    // すでに初期化されてるなら何もしない。エラーも返さない。
    if (this.instance) return;
    this.instance = new RepositoryRegistry(
      budgetPlanRepository,
      calendarRepository,
      categoryRepository,
      expenseRepository,
      todayRepository,
    );
  }
}

export default RepositoryRegistry;
