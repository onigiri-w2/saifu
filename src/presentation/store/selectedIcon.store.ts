import { proxy } from 'valtio';

import { IconColor } from '@/src/domain/types/categoryIconColor';
import { IconName } from '@/src/domain/types/categoryIconName';

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
