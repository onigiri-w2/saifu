import { IconName } from '@/src/domain/aggregation/category/types/iconName';

import icons from './data';

type Props = {
  iconName: IconName;
  iconColor: string;
  size: number;
};

function CategoryIcon({ iconName, iconColor, size = 20 }: Props) {
  const Icon = icons[iconName];

  if (!Icon) {
    return <icons.fork width={size} height={size} fill={iconColor} />;
  }

  return <Icon width={size} height={size} fill={iconColor} />;
}

export default CategoryIcon;
