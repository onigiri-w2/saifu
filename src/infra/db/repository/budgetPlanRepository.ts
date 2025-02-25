import { BudgetPlanRepositoryError } from '@/src/domain/error';
import BudgetPlan, { BudgetPlanId } from '@/src/domain/model/aggregation/budgetPlan';
import IBudgetPlanRepository from '@/src/domain/model/aggregation/budgetPlan/repository.type';
import BudgetRegularlyStrategy from '@/src/domain/model/aggregation/budgetPlan/strategy/regularly';
import { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import Money from '@/src/domain/model/valueobject/money';
import { NotImplementedError, assert } from '@/src/utils/errors';

import { db } from '../client';
import { BudgetPlanTable, BudgetRegularyStrategyTable } from '../schema/tables';

const PLAN_TABLE_NAME = 'budgetPlans';
const REGULARLY_STRATEGY_TABLE_NAME = 'budgetRegularyStrategies';

const CATEGORY_IDS_DELIMITER = '  ';

class DbBudgetPlanRepository implements IBudgetPlanRepository {
  async save(entity: BudgetPlan): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        // BudgetPlanの保存
        await transaction.deleteFrom(PLAN_TABLE_NAME).where('id', '=', entity.id.value).execute();
        await transaction
          .insertInto(PLAN_TABLE_NAME)
          .values({
            id: entity.id.value,
            categoryIds: entity.categoryIds.map((id) => id.value).join(CATEGORY_IDS_DELIMITER),
            strategyType: entity.strategy.type,
          })
          .execute();

        // Strategyの保存
        await transaction
          .deleteFrom(REGULARLY_STRATEGY_TABLE_NAME)
          .where('budgetPlanId', '=', entity.id.value)
          .execute();
        switch (entity.strategy.type) {
          case 'regularly':
            await transaction
              .insertInto(REGULARLY_STRATEGY_TABLE_NAME)
              .values({
                budgetPlanId: entity.id.value,
                amount: entity.strategy.amount.value,
                cycle: entity.strategy.cycle,
                tempAmount: entity.strategy.tempAmount?.value,
              })
              .execute();
            break;
          default:
            throw new NotImplementedError('Strategy type', entity.strategy.type);
        }
      });
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の保存に失敗しました', {
        cause: e,
        context: {
          entity,
        },
      });
    }
  }

  async remove(id: BudgetPlanId): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        await transaction.deleteFrom(PLAN_TABLE_NAME).where('id', '=', id.value).execute();
        await transaction.deleteFrom(REGULARLY_STRATEGY_TABLE_NAME).where('budgetPlanId', '=', id.value).execute();
      });
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の削除に失敗しました', {
        cause: e,
        context: {
          id,
        },
      });
    }
  }

  async find(id: BudgetPlanId): Promise<BudgetPlan | undefined> {
    try {
      const budgetPlanRecord = await db
        .selectFrom(PLAN_TABLE_NAME)
        .selectAll()
        .where('id', '=', id.value)
        .executeTakeFirst();
      if (!budgetPlanRecord) return undefined;

      const strategyRecord = await this.loadStrategy(budgetPlanRecord);
      return Record2Entity.budgetPlan(budgetPlanRecord, strategyRecord);
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の取得に失敗しました', {
        cause: e,
        context: {
          id,
        },
      });
    }
  }

  async findByCategoryId(categoryId: TransactionCategoryId) {
    try {
      const budgetPlanRecord = await db
        .selectFrom(PLAN_TABLE_NAME)
        .selectAll()
        .where('categoryIds', 'like', `%${categoryId.value}%`)
        .executeTakeFirst();
      if (!budgetPlanRecord) return undefined;

      const strategyRecord = await this.loadStrategy(budgetPlanRecord);
      return Record2Entity.budgetPlan(budgetPlanRecord, strategyRecord);
    } catch (e) {
      throw new BudgetPlanRepositoryError('カテゴリIDに紐づく予算計画の取得に失敗しました', {
        cause: e,
        context: {
          categoryId,
        },
      });
    }
  }

  async findAll(): Promise<BudgetPlan[]> {
    try {
      const budgetPlanRecords = await db.selectFrom(PLAN_TABLE_NAME).selectAll().execute();
      const strategyRecords = await this.loadStrategies(budgetPlanRecords);

      return budgetPlanRecords.map((record) => {
        const strategyRecord = strategyRecords.find((strategy) => strategy.budgetPlanId === record.id);
        assert(strategyRecord, 'Strategy record not found');
        return Record2Entity.budgetPlan(record, strategyRecord);
      });
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private async loadStrategies(budgetPlanRecords: BudgetPlanTable[]): Promise<BudgetRegularyStrategyTable[]> {
    const budgetPlanIds = budgetPlanRecords.map((record) => record.id);
    const strategyRecords = await db
      .selectFrom(REGULARLY_STRATEGY_TABLE_NAME)
      .selectAll()
      .where('budgetPlanId', 'in', budgetPlanIds)
      .execute();
    const check = new Set(budgetPlanIds).size === new Set(strategyRecords.map((record) => record.budgetPlanId)).size;
    if (!check) {
      throw new BudgetPlanRepositoryError('BudgetPlanのStrategyが見つかりません', {
        context: {
          budgetPlanIds,
          regularStrategis: strategyRecords,
        },
      });
    }

    return strategyRecords;
  }

  private async loadStrategy(budgetPlanRecord: BudgetPlanTable): Promise<BudgetRegularyStrategyTable> {
    switch (budgetPlanRecord.strategyType) {
      case 'regularly': {
        // 波括弧を追加
        const strategyRecord = await db
          .selectFrom(REGULARLY_STRATEGY_TABLE_NAME)
          .selectAll()
          .where('budgetPlanId', '=', budgetPlanRecord.id)
          .executeTakeFirst();
        if (!strategyRecord) {
          throw new BudgetPlanRepositoryError('BudgetPlanのStrategyが見つかりません', {
            context: {
              budgetPlanId: budgetPlanRecord.id,
              type: budgetPlanRecord.strategyType,
            },
          });
        }
        return strategyRecord;
      } // 波括弧を追加
      default:
        throw new NotImplementedError('Strategy type', budgetPlanRecord.strategyType);
    }
  }
}
export default DbBudgetPlanRepository;

class Record2Entity {
  static regularlyStrategy(record: BudgetRegularyStrategyTable): BudgetRegularlyStrategy {
    return BudgetRegularlyStrategy.build(
      Money.build(record.amount),
      record.cycle,
      record.tempAmount !== null ? Money.build(record.tempAmount) : undefined,
    );
  }

  static budgetPlan(record: BudgetPlanTable, strategy: BudgetRegularyStrategyTable): BudgetPlan {
    const categoryIds = record.categoryIds.split(CATEGORY_IDS_DELIMITER).map((id) => TransactionCategoryId.build(id));
    return BudgetPlan.build(BudgetPlanId.build(record.id), categoryIds, this.regularlyStrategy(strategy));
  }
}
