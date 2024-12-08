import { createContext, useContext } from 'react';

import { FormDataStore } from '../type';

type FormStoreContextValue = FormDataStore;
export const FormStoreContext = createContext({} as FormStoreContextValue);

export const useFormStoreContext = () => useContext(FormStoreContext);
