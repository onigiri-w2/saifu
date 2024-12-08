import { View, Text } from 'react-native';

import { useStyles } from 'react-native-unistyles';

import CalendarSvg from '@/assets/icons/lucide/calendar.svg';

import { commonStylesheet } from '../style';

export default function DateRow() {
  const { styles, theme } = useStyles(commonStylesheet);

  return (
    <View style={styles.container}>
      <CalendarSvg width={theme.fontSize.subHeading} height={theme.fontSize.subHeading} stroke="#000" />
      <Text style={styles.label}>日付</Text>
      <View style={styles.valueWrapper}>
        <Text style={styles.value}>2024年1月1日</Text>
      </View>
    </View>
  );
}
