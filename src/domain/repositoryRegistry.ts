import { assert } from '../utils/errors';

import IBudgetPlanRepository from './aggregation/budgetPlan/repository.type';
import ICalendarRepository from './aggregation/calendar/repository.type';
import IExpenseCategoryRepository from './aggregation/expenseCategory/repository.type';
import IExpenseRepository from './aggregation/expense/repository.type';
import IIncomeRepository from './aggregation/income/repository.type';
import IIncomeCategoryRepository from './aggregation/incomeCategory/repository.type';
import ITodayRepository from './aggregation/today/repository.type';

// NOTE: このファイルのあるべき位置が不明。とりあえずdomain層に置いてる...

class RepositoryRegistry {
  private static instance: RepositoryRegistry | null = null;

  readonly budgetPlanRepository!: IBudgetPlanRepository;
  readonly calendarRepository!: ICalendarRepository;
  readonly categoryRepository!: IExpenseCategoryRepository;
  readonly incomeCategoryRepository!: IIncomeCategoryRepository;
  readonly expenseRepository!: IExpenseRepository;
  readonly incomeRepository!: IIncomeRepository;
  readonly todayRepository!: ITodayRepository;

  private constructor(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    categoryRepository: IExpenseCategoryRepository,
    incomeCategoryRepository: IIncomeCategoryRepository,
    expenseRepository: IExpenseRepository,
    incomeRepository: IIncomeRepository,
    todayRepository: ITodayRepository,
  ) {
    this.budgetPlanRepository = budgetPlanRepository;
    this.calendarRepository = calendarRepository;
    this.categoryRepository = categoryRepository;
    this.incomeCategoryRepository = incomeCategoryRepository;
    this.expenseRepository = expenseRepository;
    this.incomeRepository = incomeRepository;
    this.todayRepository = todayRepository;
  }

  static getInstance(): RepositoryRegistry {
    assert(this.instance, 'RepositoryRegistryが初期化されていません');
    return this.instance;
  }

  static initialize(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    categoryRepository: IExpenseCategoryRepository,
    incomeCategoryRepository: IIncomeCategoryRepository,
    expenseRepository: IExpenseRepository,
    incomeRepository: IIncomeRepository,
    todayRepository: ITodayRepository,
  ) {
    // すでに初期化されてるなら何もしない。エラーも返さない。
    if (this.instance) return;
    this.instance = new RepositoryRegistry(
      budgetPlanRepository,
      calendarRepository,
      categoryRepository,
      incomeCategoryRepository,
      expenseRepository,
      incomeRepository,
      todayRepository,
    );
  }
}

export default RepositoryRegistry;
