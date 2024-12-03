import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import StartMonthUpdater from '../../features/settings/pages/calendar/components/StartMonthUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartMonth'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startMonth } = route.params;
  const navigation = useNavigation();

  return <StartMonthUpdater initialStartMonth={startMonth} onSelected={navigation.goBack} />;
}
