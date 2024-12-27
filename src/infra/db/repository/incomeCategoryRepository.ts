import IncomeCategory, { IncomeCategoryId } from '@/src/domain/aggregation/incomeCategory';
import IIncomeCategoryRepository from '@/src/domain/aggregation/incomeCategory/repository.type';
import { IncomeCategoryRepositoryError } from '@/src/domain/error';

import { db } from '../client';
import { IncomeCategoryTable } from '../schema/tables';

const TABLE_NAME = 'incomeCategories';
class DbIncomeCategoryRepository implements IIncomeCategoryRepository {
  async save(entity: IncomeCategory): Promise<void> {
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
      throw new IncomeCategoryRepositoryError('IncomeCategoryデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }

  async remove(id: IncomeCategoryId): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom(TABLE_NAME).where('id', '=', id.value).execute();
      });
    } catch (e) {
      throw new IncomeCategoryRepositoryError('IncomeCategoryデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async find(id: IncomeCategoryId): Promise<IncomeCategory | undefined> {
    try {
      const record = await db.selectFrom('incomeCategories').selectAll().where('id', '=', id.value).executeTakeFirst();
      if (!record) return undefined;

      return this.record2Entity(record);
    } catch (e) {
      throw new IncomeCategoryRepositoryError('IncomeCategoryデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async findAll(): Promise<IncomeCategory[]> {
    try {
      const records = await db.selectFrom(TABLE_NAME).selectAll().execute();
      return records.map((record) => this.record2Entity(record));
    } catch (e) {
      throw new IncomeCategoryRepositoryError('IncomeCategoryデータの全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private record2Entity(record: IncomeCategoryTable): IncomeCategory {
    return IncomeCategory.build(IncomeCategoryId.build(record.id), record.name, record.iconName, record.iconColor);
  }
}
export default DbIncomeCategoryRepository;
