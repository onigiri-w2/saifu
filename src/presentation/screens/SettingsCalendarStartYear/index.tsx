import { View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import StartYearUpdater from '../../features/settings/pages/calendar/components/StartYearUpdator';
import { SettingsStackParamList } from '../../navigation/settingsStack';
import { utilStyleSheet } from '../../style/utilStyleSheet';

type CategoryDetailRouteProp = RouteProp<SettingsStackParamList, 'SettingsCalendarStartYear'>;
export default function Page() {
  const route = useRoute<CategoryDetailRouteProp>();
  const { startYear } = route.params;
  const navigation = useNavigation();
  const { styles } = useStyles(utilStyleSheet);

  return (
    <View style={styles.screen}>
      <StartYearUpdater initialStartYear={startYear} onSelected={navigation.goBack} />
    </View>
  );
}
