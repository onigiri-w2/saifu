import BudgetPlan from '@/src/domain/aggregation/budgetPlan';
import IBudgetPlanRepository from '@/src/domain/aggregation/budgetPlan/repository.type';
import BudgetNoneStrategy from '@/src/domain/aggregation/budgetPlan/strategy/none';
import BudgetRegularlyStrategy from '@/src/domain/aggregation/budgetPlan/strategy/regularly';
import { BudgetPlanRepositoryError } from '@/src/domain/error';
import Money from '@/src/domain/valueobject/money';
import { NotImplementedError } from '@/src/utils/errors';

import { db } from '../client';
import { BudgetPlanTable, BudgetRegularyStrategyTable } from '../schema';

class DbBudgetPlanRepository implements IBudgetPlanRepository {
  async save(entity: BudgetPlan): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        // BudgetPlanの保存
        await transaction.deleteFrom('budgetPlans').where('id', '=', entity.id).execute();
        await transaction
          .insertInto('budgetPlans')
          .values({ id: entity.id, categoryId: entity.categoryId, strategyType: entity.strategy.type })
          .execute();

        // Strategyの保存
        await transaction.deleteFrom('budgetRegularyStrategies').where('budgetPlanId', '=', entity.id).execute();
        switch (entity.strategy.type) {
          case 'none':
            break;
          case 'regularly':
            await transaction
              .insertInto('budgetRegularyStrategies')
              .values({
                budgetPlanId: entity.id,
                amount: entity.strategy.amount.value,
                cycle: entity.strategy.cycle,
                tempAmount: entity.strategy.tempAmount?.value,
              })
              .execute();
            break;
          default:
            throw new NotImplementedError('Strategy type', entity.strategy);
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

  async remove(id: string): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        await transaction.deleteFrom('budgetPlans').where('id', '=', id).execute();
        await transaction.deleteFrom('budgetRegularyStrategies').where('budgetPlanId', '=', id).execute();
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

  async removeByCategoryId(categoryId: string): Promise<void> {
    try {
      await db.transaction().execute(async (transaction) => {
        // 削除対象のプランIDを取得
        const planIds = await transaction
          .selectFrom('budgetPlans')
          .select('id')
          .where('categoryId', '=', categoryId)
          .execute()
          .then((plans) => plans.map((plan) => plan.id));

        if (planIds.length === 0) return;

        // budgetRegularyStrategiesを一括削除
        await transaction.deleteFrom('budgetRegularyStrategies').where('budgetPlanId', 'in', planIds).execute();

        // budgetPlansを一括削除
        await transaction.deleteFrom('budgetPlans').where('id', 'in', planIds).execute();
      });
    } catch (e) {
      throw new BudgetPlanRepositoryError('カテゴリに紐づく予算計画の削除に失敗しました', {
        cause: e,
        context: {
          categoryId,
        },
      });
    }
  }

  async find(id: string): Promise<BudgetPlan | undefined> {
    try {
      const budgetPlanRecord = await db.selectFrom('budgetPlans').selectAll().where('id', '=', id).executeTakeFirst();
      if (!budgetPlanRecord) return undefined;

      const strategy = await this.getBudgetStrategy(budgetPlanRecord);
      return BudgetPlan.build(budgetPlanRecord.id, budgetPlanRecord.categoryId, strategy);
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の取得に失敗しました', {
        cause: e,
        context: {
          id,
        },
      });
    }
  }

  async findByCategoryId(categoryId: string) {
    try {
      const budgetPlanRecord = await db
        .selectFrom('budgetPlans')
        .selectAll()
        .where('categoryId', '=', categoryId)
        .executeTakeFirst();

      if (!budgetPlanRecord) return undefined;

      const strategy = await this.getBudgetStrategy(budgetPlanRecord);
      return BudgetPlan.build(budgetPlanRecord.id, budgetPlanRecord.categoryId, strategy);
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
      return await db.transaction().execute(async (transaction) => {
        const budgetPlanRecs = await transaction.selectFrom('budgetPlans').selectAll().execute();
        const regularlyStrategyRecs = await transaction.selectFrom('budgetRegularyStrategies').selectAll().execute();

        return budgetPlanRecs.map((planRec) => {
          const strategyRec = regularlyStrategyRecs.find((rec) => rec.budgetPlanId === planRec.id);

          let strategy;
          if (strategyRec && planRec.strategyType === 'regularly') {
            strategy = this.budgetRegularyStrategyRecordToEntity(strategyRec);
          } else if (planRec.strategyType === 'regularly' && !strategyRec) {
            throw new BudgetPlanRepositoryError('BudgetPlanのStrategyが見つかりません', {
              context: {
                budgetPlanId: planRec.id,
                type: planRec.strategyType,
              },
            });
          } else {
            strategy = BudgetNoneStrategy.build();
          }
          return BudgetPlan.build(planRec.id, planRec.categoryId, strategy);
        });
      });
    } catch (e) {
      throw new BudgetPlanRepositoryError('予算計画の全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private async getBudgetStrategy(budgetPlan: BudgetPlanTable) {
    if (budgetPlan.strategyType === 'none') return BudgetNoneStrategy.build();
    else if (budgetPlan.strategyType === 'regularly') {
      const strategyRecord = await db
        .selectFrom('budgetRegularyStrategies')
        .selectAll()
        .where('budgetPlanId', '=', budgetPlan.id)
        .executeTakeFirst();
      if (!strategyRecord) {
        throw new BudgetPlanRepositoryError('BudgetPlanのStrategyが見つかりません', {
          context: {
            budgetPlanId: budgetPlan.id,
            type: budgetPlan.strategyType,
          },
        });
      }
      return this.budgetRegularyStrategyRecordToEntity(strategyRecord);
    } else {
      throw new NotImplementedError('Strategy type', budgetPlan.strategyType);
    }
  }

  private budgetRegularyStrategyRecordToEntity(record: BudgetRegularyStrategyTable): BudgetRegularlyStrategy {
    return BudgetRegularlyStrategy.build(
      Money.build(record.amount),
      record.cycle,
      record.tempAmount !== null ? Money.build(record.tempAmount) : undefined,
    );
  }
}
export default DbBudgetPlanRepository;
