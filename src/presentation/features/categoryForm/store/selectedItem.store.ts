import { proxy } from 'valtio';

export type SelectedItem = 'strategy/regularly/amount' | 'strategy/regularly/cycle' | 'strategy/regularly/tempAmount';
export type SelectedItemStore = {
  selected?: SelectedItem;
};

export const createSelectedItemStore = () => {
  return proxy<SelectedItemStore>({
    selected: undefined,
  });
};
