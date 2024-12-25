import { createContext, useContext } from 'react';

import { BudgetingCategory } from '@/src/presentation/usecase/query/budgeting-category/functions';

type CategoryContextValue = BudgetingCategory[];
export const CategoryContext = createContext({} as CategoryContextValue);
export const useCategoryContext = () => useContext(CategoryContext);
