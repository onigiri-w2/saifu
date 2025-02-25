import { createContext, useContext } from 'react';

import { FormDataStore } from '../type';

type StoreContextType = {
  formDataStore: FormDataStore;
};
export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const useStoreContext = () => useContext(StoreContext);
