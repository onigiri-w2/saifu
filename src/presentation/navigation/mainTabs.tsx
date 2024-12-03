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
    <Tab.Navigator>
      <Tab.Screen name="BudgetMonitorList" component={BudgetMonitorList} options={{ tabBarLabel: 'ホーム' }} />
      <Tab.Screen name="CategoryList" component={CategoryList} options={{ tabBarLabel: 'カテゴリ' }} />
      <Tab.Screen name="CashFlow" component={CashFlow} options={{ tabBarLabel: 'カテゴリ' }} />
      <Tab.Screen name="SettingsHome" component={SettingsStack} options={{ tabBarLabel: '設定' }} />
    </Tab.Navigator>
  );
}
