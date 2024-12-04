import { useMemo } from 'react';

import Expense from '@/src/domain/aggregation/expense';
import LocalDate from '@/src/domain/valueobject/localdate';
import { DailyStock } from '@/src/domain/valueobject/timeseries';
import { BudgetingCategory } from '@/src/presentation/usecase/query/budgeting-category/functions';
import { CostStock } from '@/src/presentation/usecase/query/cost-stocks/functions';

import { ExpenseViewData, StockViewData } from '../../types';

export const useStocksWithCategory = (stocks: CostStock[], categories: BudgetingCategory[]) => {
  return useMemo(() => {
    if (stocks.length === 0 || categories.length === 0) return [];
    return stocks
      .map((d) => {
        const category = categories.find((c) => c.category.id === d.categoryId);
        if (!category) return null;
        return { category: category.category, stock: d.stock };
      })
      .filter((v): v is StockViewData => v !== null);
  }, [stocks, categories]);
};

export const useTimeline = (expenses: Expense[], categories: BudgetingCategory[]) => {
  return useMemo(() => {
    if (expenses.length === 0 || categories.length === 0) return [];

    const result: (LocalDate | ExpenseViewData)[] = [];
    let currentDate = LocalDate.fromDate(expenses[0].date);

    result.push(currentDate, { category: categories[0].category, expense: expenses[0] });
    expenses.slice(1).forEach((expense) => {
      const localDate = LocalDate.fromDate(expense.date);

      if (currentDate.isSame(localDate)) {
        currentDate = localDate;
        result.push(currentDate);
      }
      result.push({ category: categories[0].category, expense });
    });

    return result;
  }, [expenses, categories]);
};

export const useAggregatedStock = (stocks: CostStock[]) => {
  return useMemo(() => {
    if (stocks.length === 0) return undefined;
    return DailyStock.aggregate(stocks.map((d) => d.stock));
  }, [stocks]);
};
