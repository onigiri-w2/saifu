import { View, Text } from 'react-native';

import { useStyles } from 'react-native-unistyles';

import LayoutGridSvg from '@/assets/icons/lucide/layout-grid_1.75px.svg';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

import { commonStylesheet } from '../style';

export default function CategoryRow() {
  const { styles, theme } = useStyles(commonStylesheet);

  return (
    <View style={styles.container}>
      <LayoutGridSvg
        width={theme.fontSize.subHeading}
        height={theme.fontSize.subHeading}
        stroke={theme.colors.text.primary}
      />
      <Text style={styles.label}>カテゴリ</Text>
      <View style={styles.valueWrapper}>
        <CategoryIcon iconName="car" iconColor={theme.colors.text.primary} size={theme.fontSize.subHeading} />
        <Text style={styles.value}>交通費</Text>
      </View>
    </View>
  );
}
