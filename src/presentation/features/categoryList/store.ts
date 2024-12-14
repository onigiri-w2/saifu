import { proxy } from 'valtio';
import { proxyMap } from 'valtio/utils';

import { toggle } from '@/src/utils/boolean';

export type CategoryToggleMapStore = {
  rowCollapseStates: Map<string, boolean>;
  toggleRowCollapseState: (categoryId: string) => void;
};

export const createCategoryToggleMapStore = (categoryIds: string[]) => {
  const initialRowCollapseStates = new Map<string, boolean>();
  categoryIds.forEach((id) => {
    initialRowCollapseStates.set(id, false);
  });

  const store = proxy<CategoryToggleMapStore>({
    rowCollapseStates: proxyMap<string, boolean>(initialRowCollapseStates),

    toggleRowCollapseState(categoryId) {
      const targetState = this.rowCollapseStates.get(categoryId) ?? false;
      this.rowCollapseStates.set(categoryId, toggle(targetState));

      // 他のカテゴリーの展開状態をリセット
      this.rowCollapseStates.forEach((_, key) => {
        if (key !== categoryId) {
          this.rowCollapseStates.set(key, false);
        }
      });
    },
  });

  return store;
};
