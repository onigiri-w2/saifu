import Expense from '@/src/domain/aggregation/expense';
import IExpenseRepository from '@/src/domain/aggregation/expense/repository.type';
import { ExpenseRepositoryError } from '@/src/domain/error';
import Money from '@/src/domain/valueobject/money';

import { db } from '../client';
import { ExpenseTable } from '../schema';

class DbExpenseRepository implements IExpenseRepository {
  async save(entity: Expense): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('expenses').where('id', '=', entity.id).execute();
        await trx
          .insertInto('expenses')
          .values({
            id: entity.id,
            categoryId: entity.categoryId,
            amount: entity.amount.value,
            date: entity.date,
            memo: entity.memo,
          })
          .execute();
      });
    } catch (e) {
      throw new ExpenseRepositoryError('Expenseデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }
  async remove(id: string): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('expenses').where('id', '=', id).execute();
      });
    } catch (e) {
      throw new ExpenseRepositoryError('Expenseデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }
  async removeByCategoryId(categoryId: string): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('expenses').where('categoryId', '=', categoryId).execute();
      });
    } catch (e) {
      throw new ExpenseRepositoryError('カテゴリに紐づくExpenseデータの削除に失敗しました', {
        cause: e,
        context: { categoryId },
      });
    }
  }
  async find(id: string): Promise<Expense | undefined> {
    try {
      const record = await db.selectFrom('expenses').selectAll().where('id', '=', id).executeTakeFirst();
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
    categoryIds: string[],
    from?: Date,
    to?: Date,
    dateOrder: 'asc' | 'desc' = 'desc',
  ): Promise<Expense[]> {
    try {
      let query = db.selectFrom('expenses').selectAll();
      if (categoryIds.length !== 0) query = query.where('categoryId', 'in', categoryIds);
      if (from) query = query.where('date', '>=', from);
      if (to) query = query.where('date', '<=', to);
      const records = await query.orderBy('date', dateOrder).execute();
      return records.map((record) => this.record2entity(record));
    } catch (e) {
      throw new ExpenseRepositoryError('Expenseデータの複数取得に失敗しました', {
        cause: e,
        context: { categoryIds, from, to },
      });
    }
  }

  private record2entity(record: ExpenseTable): Expense {
    // NOTE: sqliteの仕様で、date型指定してても文字列で返されるのでDateでラップしてる。
    return Expense.build(record.id, record.categoryId, Money.build(record.amount), new Date(record.date), record.memo);
  }
}
export default DbExpenseRepository;
