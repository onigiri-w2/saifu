import { SQLiteType } from 'kysely-expo';

import type { Kysely } from 'kysely';

export const Migration20241025 = {
  up: async (db: Kysely<any>) => {
    await db.transaction().execute(async (transaction) => {
      await transaction.schema
        .createTable('expenseCategories')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('name', SQLiteType.String, (col) => col.notNull())
        .addColumn('iconName', SQLiteType.String)
        .addColumn('iconColor', SQLiteType.String)
        .execute();

      await transaction.schema
        .createTable('incomeCategories')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('name', SQLiteType.String, (col) => col.notNull())
        .addColumn('iconName', SQLiteType.String)
        .addColumn('iconColor', SQLiteType.String)
        .execute();

      await transaction.schema
        .createTable('calendars')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('startYear', SQLiteType.Number)
        .addColumn('startMonth', SQLiteType.Number)
        .addColumn('startWeek', SQLiteType.Number)
        .execute();

      await transaction.schema
        .createTable('budgetPlans')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('categoryId', SQLiteType.String, (col) => col.unique().notNull())
        .addColumn('strategyType', SQLiteType.String, (col) => col.notNull())
        .execute();

      await transaction.schema
        .createTable('budgetRegularyStrategies')
        .addColumn('budgetPlanId', SQLiteType.String, (col) => col.primaryKey().notNull())
        .addColumn('amount', SQLiteType.Number, (col) => col.notNull())
        .addColumn('cycle', SQLiteType.String, (col) => col.notNull())
        .addColumn('tempAmount', SQLiteType.Number)
        .execute();

      await transaction.schema
        .createTable('expenses')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('categoryId', SQLiteType.String, (col) => col.notNull())
        .addColumn('amount', SQLiteType.Number, (col) => col.notNull())
        .addColumn('date', SQLiteType.DateTime, (col) => col.notNull())
        .addColumn('memo', SQLiteType.String)
        .execute();

      await transaction.schema
        .createTable('incomes')
        .addColumn('id', SQLiteType.String, (col) => col.primaryKey())
        .addColumn('categoryId', SQLiteType.String, (col) => col.notNull())
        .addColumn('amount', SQLiteType.Number, (col) => col.notNull())
        .addColumn('date', SQLiteType.DateTime, (col) => col.notNull())
        .addColumn('memo', SQLiteType.String)
        .execute();
    });
  },
  down: async (db: Kysely<any>) => {
    await db.transaction().execute(async (transactionClient) => {
      await transactionClient.schema.dropTable('expenseCategories').execute();
      await transactionClient.schema.dropTable('incomeCategories').execute();
      await transactionClient.schema.dropTable('budgetRegularyStrategies').execute();
      await transactionClient.schema.dropTable('expenses').execute();
      await transactionClient.schema.dropTable('incomes').execute();
      await transactionClient.schema.dropTable('calendars').execute();
      await transactionClient.schema.dropTable('budgetPlans').execute();
    });
  },
};
