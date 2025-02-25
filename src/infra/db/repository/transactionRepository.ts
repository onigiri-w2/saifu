import { TransactionRepositoryError } from '@/src/domain/error';
import Transaction, { TransactionId } from '@/src/domain/model/aggregation/transaction';
import ITransactionRepository from '@/src/domain/model/aggregation/transaction/repository.type';
import { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import Money from '@/src/domain/model/valueobject/money';

import { db } from '../client';
import { TransactionTable } from '../schema/tables';

const TABLE_NAME = 'transactions';
class DbTransactionRepository implements ITransactionRepository {
  async save(entity: Transaction): Promise<void> {
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
            type: entity.type,
          })
          .execute();
      });
    } catch (e) {
      throw new TransactionRepositoryError('Transactionデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }
  async remove(id: TransactionId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', id.value).execute();
      });
    } catch (e) {
      throw new TransactionRepositoryError('Transactionデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }
  async removeByCategoryId(categoryId: TransactionCategoryId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('categoryId', '=', categoryId.value).execute();
      });
    } catch (e) {
      throw new TransactionRepositoryError('カテゴリに紐づくTransactionデータの削除に失敗しました', {
        cause: e,
        context: { categoryId },
      });
    }
  }
  async find(id: TransactionId): Promise<Transaction | undefined> {
    try {
      const record = await db.selectFrom(TABLE_NAME).selectAll().where('id', '=', id.value).executeTakeFirst();
      if (!record) return undefined;
      return this.record2entity(record);
    } catch (e) {
      throw new TransactionRepositoryError('Transactionデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }
  async findSome(
    type: 'income' | 'expense' | 'both',
    categoryIds: TransactionCategoryId[] = [],
    from?: Date,
    to?: Date,
    dateOrder: 'asc' | 'desc' = 'desc',
  ): Promise<Transaction[]> {
    try {
      let query = db.selectFrom(TABLE_NAME).selectAll();
      if (type !== 'both') query = query.where('type', '=', type);
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
      throw new TransactionRepositoryError('Transactionデータの複数取得に失敗しました', {
        cause: e,
        context: { categoryIds, from, to },
      });
    }
  }

  private record2entity(record: TransactionTable): Transaction {
    // NOTE: sqliteの仕様で、date型指定してても文字列で返されるのでDateでラップしてる。
    return Transaction.build(
      TransactionId.build(record.id),
      TransactionCategoryId.build(record.categoryId),
      Money.build(record.amount),
      new Date(record.date),
      record.memo,
      record.type,
    );
  }
}
export default DbTransactionRepository;
