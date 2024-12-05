import { proxy } from 'valtio';

export type FocusedItem = 'strategy/regularly/amount' | 'strategy/regularly/cycle' | 'strategy/regularly/tempAmount';
export type FormFocusStore = { focused?: FocusedItem };

export const createFormFocusStore = () => {
  return proxy<FormFocusStore>({
    focused: undefined,
  });
};
