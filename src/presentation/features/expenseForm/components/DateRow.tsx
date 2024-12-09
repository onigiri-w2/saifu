import { View, Text } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import CalendarSvg from '@/assets/icons/lucide/calendar.svg';

import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

export default function DateRow() {
  const { styles, theme } = useStyles(commonStylesheet);

  const store = useFormStoreContext();
  const timestamp = useSnapshot(store.form).timestamp;

  return (
    <View style={styles.container}>
      <CalendarSvg width={theme.fontSize.subHeading} height={theme.fontSize.subHeading} stroke="#000" />
      <Text style={styles.label}>日付</Text>
      <View style={{ marginLeft: 'auto' }}>
        <DateTimePicker value={new Date(timestamp)} mode="date" accentColor={theme.colors.brand.primary} locale="ja" />
      </View>
    </View>
  );
}
