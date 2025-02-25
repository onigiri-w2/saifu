import { IconName } from '@/src/domain/model/types/categoryIconName';

import icons from './data';

type Props = {
  iconName: IconName;
  iconColor: string;
  size: number;
};

function CategoryIcon({ iconName, iconColor, size = 20 }: Props) {
  const Icon = icons[iconName];

  if (Icon === undefined) {
    return <icons.fork width={size} height={size} fill={iconColor} />;
  }

  return <Icon width={size} height={size} fill={iconColor} />;
}

export default CategoryIcon;
