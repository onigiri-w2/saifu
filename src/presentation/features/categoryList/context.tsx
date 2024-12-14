import { createContext, useContext } from 'react';

import { CategoryToggleMapStore } from './store';

type CategoryToggleMapStoreContextType = CategoryToggleMapStore;
export const CategoryToggleMapStoreContext = createContext<CategoryToggleMapStoreContextType>(
  {} as CategoryToggleMapStoreContextType,
);

export const useEnrichedCategoryListContext = () => useContext(CategoryToggleMapStoreContext);
