import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BudgetMonitorList from '@/src/presentation/screens/BudgetMonitorList';
import CashFlow from '@/src/presentation/screens/CashFlow';
import CategoryList from '@/src/presentation/screens/CategoryList';

import SettingsStack from './settingsStack';

export type MainTabParamList = {
  BudgetMonitorList: undefined;
  CategoryList: undefined;
  CashFlow: undefined;
  SettingsHome: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          shadowColor: 'transparent', // iOS用
          elevation: 0, // Android用
        },
      }}
    >
      <Tab.Screen
        name="BudgetMonitorList"
        component={BudgetMonitorList}
        options={{ tabBarLabel: '予算', title: '予算' }}
      />
      <Tab.Screen
        name="CategoryList"
        component={CategoryList}
        options={{ tabBarLabel: 'カテゴリ', title: 'カテゴリ' }}
      />
      <Tab.Screen name="CashFlow" component={CashFlow} options={{ tabBarLabel: '支出', title: '支出' }} />
      <Tab.Screen name="SettingsHome" component={SettingsStack} options={{ tabBarLabel: '設定', headerShown: false }} />
    </Tab.Navigator>
  );
}
