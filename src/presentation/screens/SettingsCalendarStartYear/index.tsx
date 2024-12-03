import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import StartYearUpdater from '../../features/settings/pages/calendar/components/StartYearUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartYear'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startYear } = route.params;
  const navigation = useNavigation();

  return <StartYearUpdater initialStartYear={startYear} onSelected={navigation.goBack} />;
}
