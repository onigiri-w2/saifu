import { createContext, useContext, useRef } from 'react';

import { Store, createStore } from './store';

type StoreContextType = Store;
const StoreContext = createContext<StoreContextType>({} as StoreContextType);

type StoreProviderProps = {
  categoryIds: string[];
  children: React.ReactNode;
};
export function StoreProvider({ categoryIds, children }: StoreProviderProps) {
  const store = useRef<Store>();
  if (!store.current) {
    store.current = createStore(categoryIds);
  }

  return <StoreContext.Provider value={store.current}>{children}</StoreContext.Provider>;
}

export const useEnrichedCategoryListContext = () => useContext(StoreContext);
