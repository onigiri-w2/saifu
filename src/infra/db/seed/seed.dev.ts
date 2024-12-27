import { faker } from '@faker-js/faker';
import uuid from 'react-native-uuid';

import { ONE_ID } from '@/src/domain/aggregation/calendar';
import { iconColors } from '@/src/domain/types/categoryIconColor';
import { iconNames } from '@/src/domain/types/categoryIconName';

import { db } from '../client';
import { BudgetPlanTable, BudgetRegularyStrategyTable, CalendarTable, ExpenseCategoryTable } from '../schema/tables';

export const seedDevelopmentData = async () => {
  if (!__DEV__) return;

  await db.transaction().execute(async (transactionClient) => {
    // Category Recordsを生成
    await transactionClient.deleteFrom('expenseCategories').execute();
    const sampleCategories: ExpenseCategoryTable[] = Array.from({ length: 10 }).map(() => ({
      id: uuid.v4().toString(),
      name: faker.lorem.words(1),
      iconName: iconNames[Math.floor(Math.random() * iconNames.length)],
      iconColor: iconColors[Math.floor(Math.random() * iconColors.length)],
    }));
    await transactionClient.insertInto('expenseCategories').values(sampleCategories).execute();

    // BudgetPlan Recordsを生成
    await transactionClient.deleteFrom('budgetPlans').execute();
    await transactionClient.deleteFrom('budgetRegularyStrategies').execute();
    const sampleBudgetPlans: BudgetPlanTable[] = sampleCategories.map((category) => ({
      id: uuid.v4().toString(),
      categoryId: category.id,
      strategyType: Math.random() > 0.5 ? 'regularly' : 'none',
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
    await transactionClient.deleteFrom('expenses').execute();
    const today = new Date();
    const sampleExpenses = Array.from({ length: 30 }).map(() => ({
      id: uuid.v4().toString(),
      categoryId: sampleCategories[Math.floor(Math.random() * sampleCategories.length)].id,
      amount: Math.floor(Math.random() * 1000),
      date: faker.date.between({
        from: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 14),
        to: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 14),
      }),
      memo: faker.lorem.words(Math.floor(Math.random() * 2)),
    }));
    await transactionClient.insertInto('expenses').values(sampleExpenses).execute();
  });
};
