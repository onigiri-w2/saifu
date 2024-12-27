import ExpenseCategory, { ExpenseCategoryId } from '@/src/domain/aggregation/expenseCategory';
import IExpenseCategoryRepository from '@/src/domain/aggregation/expenseCategory/repository.type';
import { CategoryRepositoryError } from '@/src/domain/error';

import { db } from '../client';
import { ExpenseCategoryTable } from '../schema/tables';

const TABLE_NAME = 'expenseCategories';

class DbExpenseCategoryRepository implements IExpenseCategoryRepository {
  async save(entity: ExpenseCategory): Promise<void> {
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
            })
            .execute();
        }
      });
    } catch (e) {
      throw new CategoryRepositoryError('ExpenseCategoryデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }

  async remove(id: ExpenseCategoryId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', id.value).execute();
      });
    } catch (e) {
      throw new CategoryRepositoryError('ExpenseCategoryデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async find(id: ExpenseCategoryId): Promise<ExpenseCategory | undefined> {
    try {
      const record = await db.selectFrom(TABLE_NAME).selectAll().where('id', '=', id.value).executeTakeFirst();
      if (!record) return undefined;

      return this.record2Entity(record);
    } catch (e) {
      throw new CategoryRepositoryError('ExpenseCategoryデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async findAll(): Promise<ExpenseCategory[]> {
    try {
      const records = await db.selectFrom(TABLE_NAME).selectAll().execute();
      return records.map((record) => this.record2Entity(record));
    } catch (e) {
      throw new CategoryRepositoryError('ExpenseCategoryデータの全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private record2Entity(record: ExpenseCategoryTable): ExpenseCategory {
    return ExpenseCategory.build(ExpenseCategoryId.build(record.id), record.name, record.iconName, record.iconColor);
  }
}
export default DbExpenseCategoryRepository;
