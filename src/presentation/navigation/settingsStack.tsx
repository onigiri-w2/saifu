import { NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Day, DayOfWeek, Month } from '@/src/domain/valueobject/types';
import SettingsCalendar from '@/src/presentation/screens/SettingsCalendar';
import SettingsCalendarStartMonth from '@/src/presentation/screens/SettingsCalendarStartMonth';
import SettingsCalendarStartWeek from '@/src/presentation/screens/SettingsCalendarStartWeek';
import SettingsCalendarStartYear from '@/src/presentation/screens/SettingsCalendarStartYear';
import SettingsHome from '@/src/presentation/screens/SettingsHome';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  SettingsCalendar: undefined;
  SettingsCalendarStartYear: { startYear: Month };
  SettingsCalendarStartMonth: { startMonth: Day };
  SettingsCalendarStartWeek: { startWeek: DayOfWeek };
};
export type SettingsStackNavigationProp = NavigationProp<SettingsStackParamList>;

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsHome">
      <Stack.Screen name="SettingsHome" component={SettingsHome} options={{ headerShown: false }} />
      <Stack.Screen name="SettingsCalendar" component={SettingsCalendar} options={{ headerShown: false }} />
      <Stack.Screen
        name="SettingsCalendarStartYear"
        component={SettingsCalendarStartYear}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsCalendarStartMonth"
        component={SettingsCalendarStartMonth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsCalendarStartWeek"
        component={SettingsCalendarStartWeek}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
