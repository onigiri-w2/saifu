import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import StartWeekUpdater from '../../features/settings/pages/calendar/components/StartWeekUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartWeek'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startWeek } = route.params;
  const navigation = useNavigation();

  return <StartWeekUpdater initialStartWeek={startWeek} onSelected={navigation.goBack} />;
}
