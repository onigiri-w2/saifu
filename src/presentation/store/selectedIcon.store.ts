import { proxy } from 'valtio';

import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';

type SelectedIconStore = {
  selected: {
    iconName: IconName;
    iconColor: IconColor;
  };
};

export const selectedIconGlobalStore = proxy<SelectedIconStore>({
  selected: {
    iconName: 'fork',
    iconColor: '#FD79A8',
  },
});
