import { CategoryRepositoryError } from '@/src/domain/error';
import Category from '@/src/domain/aggregation/category';
import ICategoryRepository from '@/src/domain/aggregation/category/repository.type';

import { db } from '../client';
import { CategoryTable } from '../schema';
class DbCategoryRepository implements ICategoryRepository {
  async save(entity: Category): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        const isExist = await trx.selectFrom('categories').select('id').where('id', '=', entity.id).executeTakeFirst();

        if (isExist) {
          await trx
            .updateTable('categories')
            .set({
              name: entity.name,
              iconName: entity.iconName,
              iconColor: entity.iconColor,
            })
            .where('id', '=', entity.id)
            .execute();
        } else {
          await trx
            .insertInto('categories')
            .values({
              id: entity.id,
              name: entity.name,
              iconName: entity.iconName,
              iconColor: entity.iconColor,
            })
            .execute();
        }
      });
    } catch (e) {
      throw new CategoryRepositoryError('Categoryデータの保存に失敗しました', {
        cause: e,
        context: { entity },
      });
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('categories').where('id', '=', id).execute();
      });
    } catch (e) {
      throw new CategoryRepositoryError('Categoryデータの削除に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async find(id: string): Promise<Category | undefined> {
    try {
      const record = await db.selectFrom('categories').selectAll().where('id', '=', id).executeTakeFirst();
      if (!record) return undefined;

      return this.record2Entity(record);
    } catch (e) {
      throw new CategoryRepositoryError('Categoryデータの取得に失敗しました', {
        cause: e,
        context: { id },
      });
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const records = await db.selectFrom('categories').selectAll().execute();
      return records.map((record) => this.record2Entity(record));
    } catch (e) {
      throw new CategoryRepositoryError('Categoryデータの全件取得に失敗しました', {
        cause: e,
      });
    }
  }

  private record2Entity(record: CategoryTable): Category {
    return Category.build(record.id, record.name, record.iconName, record.iconColor);
  }
}
export default DbCategoryRepository;
