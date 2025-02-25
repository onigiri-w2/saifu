import { createContext, useContext } from 'react';

import TransactionCategory from '@/src/domain/model/aggregation/transactionCategory';

type CategoriesContextValue = TransactionCategory[];
export const CategoriesContext = createContext({} as CategoriesContextValue);
export const useCategoriesContext = () => useContext(CategoriesContext);
