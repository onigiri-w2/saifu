import { createContext, useContext } from 'react';

type ActionsContextValue = {
  onSelectExpenseItem?: (expenseId: string) => void;
};
export const ActionsContext = createContext({} as ActionsContextValue);
export const useActionsContext = () => useContext(ActionsContext);
