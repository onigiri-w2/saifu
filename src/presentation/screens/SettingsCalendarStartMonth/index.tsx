import { View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import StartMonthUpdater from '../../features/settings/pages/calendar/components/StartMonthUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';
import { utilStyleSheet } from '../../style/utilStyleSheet';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartMonth'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startMonth } = route.params;
  const navigation = useNavigation();

  const { styles } = useStyles(utilStyleSheet);

  return (
    <View style={styles.screen}>
      <StartMonthUpdater initialStartMonth={startMonth} onSelected={navigation.goBack} />;
    </View>
  );
}
