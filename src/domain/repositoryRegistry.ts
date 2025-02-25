import { assert } from '../utils/errors';

import IBudgetPlanRepository from './model/aggregation/budgetPlan/repository.type';
import ICalendarRepository from './model/aggregation/calendar/repository.type';
import ITransactionRepository from './model/aggregation/transaction/repository.type';
import ITransactionCategoryRepository from './model/aggregation/transactionCategory/repository.type';

// NOTE: このファイルのあるべき位置が不明。とりあえずdomain層に置いてる...

class RepositoryRegistry {
  private static instance: RepositoryRegistry | null = null;

  readonly budgetPlanRepository!: IBudgetPlanRepository;
  readonly calendarRepository!: ICalendarRepository;
  readonly transactionRepository!: ITransactionRepository;
  readonly transactionCategoryRepository!: ITransactionCategoryRepository;

  private constructor(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    transactionRepository: ITransactionRepository,
    transactionCategoryRepository: ITransactionCategoryRepository,
  ) {
    this.budgetPlanRepository = budgetPlanRepository;
    this.calendarRepository = calendarRepository;
    this.transactionRepository = transactionRepository;
    this.transactionCategoryRepository = transactionCategoryRepository;
  }

  static getInstance(): RepositoryRegistry {
    assert(this.instance, 'RepositoryRegistryが初期化されていません');
    return this.instance;
  }

  static initialize(
    budgetPlanRepository: IBudgetPlanRepository,
    calendarRepository: ICalendarRepository,
    transactionRepository: ITransactionRepository,
    transactionCategoryRepository: ITransactionCategoryRepository,
  ) {
    // すでに初期化されてるなら何もしない。エラーも返さない。
    if (this.instance) return;
    this.instance = new RepositoryRegistry(
      budgetPlanRepository,
      calendarRepository,
      transactionRepository,
      transactionCategoryRepository,
    );
  }
}

export default RepositoryRegistry;
