import { createContext, useContext } from 'react';

import { OnSavedFunction, OnRemovedFunction } from '../type';

type ActionsContextValue = {
  onSaved?: OnSavedFunction;
  onRemoved?: OnRemovedFunction;
};
export const ActionsContext = createContext({} as ActionsContextValue);

export const useActionsContext = () => useContext(ActionsContext);
