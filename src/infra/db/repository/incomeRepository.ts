import Income, { IncomeId } from '@/src/domain/aggregation/income';
import IIncomeRepository from '@/src/domain/aggregation/income/repository.type';
import { IncomeCategoryId } from '@/src/domain/aggregation/incomeCategory';
import { ExpenseRepositoryError, IncomeRepositoryError } from '@/src/domain/error';
import Money from '@/src/domain/valueobject/money';

import { db } from '../client';
import { IncomeTable } from '../schema/tables';

const TABLE_NAME = 'incomes';
class DbIncomeRepository implements IIncomeRepository {
  async save(entity: Income): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', entity.id.value).execute();
        await trx
          .insertInto(TABLE_NAME)
          .values({
            id: entity.id.value,
            categoryId: entity.categoryId.value,
            amount: entity.amount.value,
            date: entity.date,
            memo: entity.memo,
          })
          .execute();
      });
    } catch (e) {
      throw new IncomeRepositoryError('Incomeデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }
  async remove(id: IncomeId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', id.value).execute();
      });
    } catch (e) {
      throw new IncomeRepositoryError('Incomeデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }
  async removeByCategoryId(categoryId: IncomeCategoryId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('categoryId', '=', categoryId.value).execute();
      });
    } catch (e) {
      throw new IncomeRepositoryError('カテゴリに紐づくIncomeデータの削除に失敗しました', {
        cause: e,
        context: { categoryId },
      });
    }
  }
  async find(id: IncomeId): Promise<Income | undefined> {
    try {
      const record = await db.selectFrom(TABLE_NAME).selectAll().where('id', '=', id.value).executeTakeFirst();
      if (!record) return undefined;
      return this.record2entity(record);
    } catch (e) {
      throw new ExpenseRepositoryError('Expenseデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }
  async findSome(
    categoryIds: IncomeCategoryId[],
    from?: Date,
    to?: Date,
    dateOrder: 'asc' | 'desc' = 'desc',
  ): Promise<Income[]> {
    try {
      let query = db.selectFrom(TABLE_NAME).selectAll();
      if (categoryIds.length !== 0) {
        query = query.where(
          'categoryId',
          'in',
          categoryIds.map((id) => id.value),
        );
      }
      if (from) query = query.where('date', '>=', from);
      if (to) query = query.where('date', '<', to);
      const records = await query.orderBy('date', dateOrder).execute();
      return records.map((record) => this.record2entity(record));
    } catch (e) {
      throw new ExpenseRepositoryError('Expenseデータの複数取得に失敗しました', {
        cause: e,
        context: { categoryIds, from, to },
      });
    }
  }

  private record2entity(record: IncomeTable): Income {
    // NOTE: sqliteの仕様で、date型指定してても文字列で返されるのでDateでラップしてる。
    return Income.build(
      IncomeId.build(record.id),
      IncomeCategoryId.build(record.categoryId),
      Money.build(record.amount),
      new Date(record.date),
      record.memo,
    );
  }
}
export default DbIncomeRepository;
