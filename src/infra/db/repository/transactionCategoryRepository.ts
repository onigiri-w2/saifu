import { CategoryRepositoryError } from '@/src/domain/error';
import TransactionCategory, { TransactionCategoryId } from '@/src/domain/model/aggregation/transactionCategory';
import ITransactionCategoryRepository from '@/src/domain/model/aggregation/transactionCategory/repository.type';

import { db } from '../client';
import { TransactionCategoryTable } from '../schema/tables';

const TABLE_NAME = 'transactionCategories';

class DbTransactionCategoryRepository implements ITransactionCategoryRepository {
  async save(entity: TransactionCategory): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        const isExist = await trx
          .selectFrom(TABLE_NAME)
          .select('id')
          .where('id', '=', entity.id.value)
          .executeTakeFirst();

        if (isExist) {
          await trx
            .updateTable(TABLE_NAME)
            .set({
              name: entity.name,
              iconName: entity.iconName,
              iconColor: entity.iconColor,
            })
            .where('id', '=', entity.id.value)
            .execute();
        } else {
          await trx
            .insertInto(TABLE_NAME)
            .values({
              id: entity.id.value,
              name: entity.name,
              iconName: entity.iconName,
              iconColor: entity.iconColor,
              type: entity.type,
            })
            .execute();
        }
      });
    } catch (e) {
      throw new CategoryRepositoryError('TransactionCategoryデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }

  async remove(id: TransactionCategoryId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', id.value).execute();
      });
    } catch (e) {
      throw new CategoryRepositoryError('TransactionCategoryデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async find(id: TransactionCategoryId): Promise<TransactionCategory | undefined> {
    try {
      const record = await db.selectFrom(TABLE_NAME).selectAll().where('id', '=', id.value).executeTakeFirst();
      if (!record) return undefined;

      return this.record2Entity(record);
    } catch (e) {
      throw new CategoryRepositoryError('TransactionCategoryデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async findAll(type: 'incomeCategory' | 'expenseCategory' | 'both'): Promise<TransactionCategory[]> {
    try {
      let query = db.selectFrom(TABLE_NAME).selectAll();
      if (type !== 'both') {
        query = query.where('type', '=', type);
      }
      const records = await query.execute();
      return records.map((record) => this.record2Entity(record));
    } catch (e) {
      throw new CategoryRepositoryError('TransactionCategoryデータの全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private record2Entity(record: TransactionCategoryTable): TransactionCategory {
    return TransactionCategory.build(
      TransactionCategoryId.build(record.id),
      record.name,
      record.iconName,
      record.iconColor,
      record.type,
    );
  }
}
export default DbTransactionCategoryRepository;
