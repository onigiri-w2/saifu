import { proxy } from 'valtio';
import { proxyMap } from 'valtio/utils';

export type Store = {
  rowCollapseStates: Map<string, boolean>;
  toggleRowCollapseState: (categoryId: string) => void;
};

export const createStore = (categoryIds: string[]) => {
  const initialRowCollapseStates = new Map<string, boolean>();
  categoryIds.forEach((id) => {
    initialRowCollapseStates.set(id, false);
  });

  const store = proxy<Store>({
    rowCollapseStates: proxyMap<string, boolean>(initialRowCollapseStates),

    toggleRowCollapseState(categoryId) {
      this.rowCollapseStates.set(categoryId, !this.rowCollapseStates.get(categoryId));

      // 他のカテゴリーの展開状態をリセット
      this.rowCollapseStates.forEach((value, key) => {
        if (key !== categoryId) {
          this.rowCollapseStates.set(key, false);
        }
      });
    },
  });

  return store;
};
