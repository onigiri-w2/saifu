import { faker } from '@faker-js/faker';
import uuid from 'react-native-uuid';

import { ONE_ID } from '@/src/domain/model/aggregation/calendar';
import { iconColors } from '@/src/domain/model/types/categoryIconColor';
import { iconNames } from '@/src/domain/model/types/categoryIconName';

import { db } from '../client';
import {
  BudgetPlanTable,
  BudgetRegularyStrategyTable,
  CalendarTable,
  TransactionCategoryTable,
  TransactionTable,
} from '../schema/tables';

const test_category_names = ['食費', '教育', '贅沢'];

export const seedDevelopmentData = async () => {
  if (!__DEV__) return;

  await db.transaction().execute(async (transactionClient) => {
    // Category Recordsを生成
    await transactionClient.deleteFrom('transactionCategories').execute();
    const sampleCategories: TransactionCategoryTable[] = test_category_names.map((n) => ({
      id: uuid.v4().toString(),
      name: n,
      iconName: iconNames[Math.floor(Math.random() * iconNames.length)],
      iconColor: iconColors[Math.floor(Math.random() * iconColors.length)],
      type: 'expenseCategory',
    }));
    await transactionClient.insertInto('transactionCategories').values(sampleCategories).execute();

    // BudgetPlan Recordsを生成
    await transactionClient.deleteFrom('budgetPlans').execute();
    await transactionClient.deleteFrom('budgetRegularyStrategies').execute();
    const sampleBudgetPlans: BudgetPlanTable[] = sampleCategories.map((category) => ({
      id: uuid.v4().toString(),
      categoryIds: category.id,
      strategyType: 'regularly',
    }));
    const sampleBudgetRegularyStrategies: BudgetRegularyStrategyTable[] = sampleBudgetPlans
      .filter((bp) => bp.strategyType === 'regularly')
      .map((bp) => ({
        budgetPlanId: bp.id,
        amount: Math.floor(Math.random() * 1000),
        cycle: ['weekly', 'monthly', 'yearly'][Math.floor(Math.random() * 3)] as 'weekly' | 'monthly' | 'yearly',
        tempAmount: Math.floor(Math.random() * 1000),
      }));
    await transactionClient.insertInto('budgetPlans').values(sampleBudgetPlans).execute();
    await transactionClient.insertInto('budgetRegularyStrategies').values(sampleBudgetRegularyStrategies).execute();

    // Calendar Recordsを生成
    await transactionClient.deleteFrom('calendars').execute();
    const sampleCalendar: CalendarTable = {
      id: ONE_ID,
      startYear: 1,
      startMonth: 1,
      startWeek: 0,
    };
    await transactionClient.insertInto('calendars').values(sampleCalendar).execute();

    // Expense Recordsを生成
    await transactionClient.deleteFrom('transactions').execute();
    const today = new Date();
    const sampleExpenses: TransactionTable[] = Array.from({ length: 30 }).map(() => ({
      id: uuid.v4().toString(),
      categoryId: sampleCategories[Math.floor(Math.random() * sampleCategories.length)].id,
      amount: Math.floor(Math.random() * 1000),
      date: faker.date.between({
        from: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 14),
        to: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 14),
      }),
      memo: faker.lorem.words(Math.floor(Math.random() * 2)),
      type: 'expense',
    }));
    await transactionClient.insertInto('transactions').values(sampleExpenses).execute();

    // Income系のRecordsを生成
    const incomeCategories: TransactionCategoryTable[] = Array.from({ length: 1 }).map(() => ({
      id: uuid.v4().toString(),
      name: faker.lorem.words(1),
      iconName: iconNames[Math.floor(Math.random() * iconNames.length)],
      iconColor: iconColors[Math.floor(Math.random() * iconColors.length)],
      type: 'incomeCategory',
    }));
    await transactionClient.insertInto('transactionCategories').values(incomeCategories).execute();

    const sampleIncom: TransactionTable = {
      id: uuid.v4().toString(),
      categoryId: incomeCategories[0].id,
      amount: 3000000,
      date: new Date(2024, 11, 15),
      memo: '',
      type: 'income',
    };
    await transactionClient.insertInto('transactions').values(sampleIncom).execute();
  });
};
