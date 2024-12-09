import { createContext, useContext } from 'react';

import Category from '@/src/domain/aggregation/category';

type CategoryListContextValue = Category[];
export const CategoryListContext = createContext({} as CategoryListContextValue);

export const useCategoryListContext = () => useContext(CategoryListContext);
