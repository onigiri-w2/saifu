import { createContext, useContext } from 'react';

import ExpenseCategory from '@/src/domain/aggregation/expenseCategory';

type CategoryListContextValue = ExpenseCategory[];
export const CategoryListContext = createContext({} as CategoryListContextValue);

export const useCategoryListContext = () => useContext(CategoryListContext);
