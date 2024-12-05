import { createContext, useContext } from 'react';

import { FormDataStore } from '../store/form.store';
import { FormFocusStore } from '../store/selectedItem.store';

type StoreContextType = {
  formDataStore: FormDataStore;
  formFocusStore: FormFocusStore;
};
export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const useStoreContext = () => useContext(StoreContext);
