import { View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import StartWeekUpdater from '../../features/settings/pages/calendar/components/StartWeekUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';
import { utilStyleSheet } from '../../style/utilStyleSheet';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartWeek'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startWeek } = route.params;
  const navigation = useNavigation();
  const { styles } = useStyles(utilStyleSheet);

  return (
    <View style={styles.screen}>
      <StartWeekUpdater initialStartWeek={startWeek} onSelected={navigation.goBack} />
    </View>
  );
}
