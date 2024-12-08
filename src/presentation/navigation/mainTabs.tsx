import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStyles } from 'react-native-unistyles';

import GraphSvg from '@/assets/icons/lucide/chart-line_1.75px.svg';
import GridSvg from '@/assets/icons/lucide/layout-grid_1.75px.svg';
import SettingsSvg from '@/assets/icons/lucide/settings_1.75px.svg';
import WalletSvg from '@/assets/icons/lucide/wallet_1.75px.svg';
import BudgetMonitorList from '@/src/presentation/screens/BudgetMonitorList';
import CashFlow from '@/src/presentation/screens/CashFlow';
import CategoryList from '@/src/presentation/screens/CategoryList';

import TabBar from '../components/TabBar';
import HeaderRightActions from '../screens/CashFlow/components/HeaderRightActions';

import SettingsStack from './settingsStack';

export type MainTabParamList = {
  BudgetMonitorList: undefined;
  CategoryList: undefined;
  CashFlow: undefined;
  SettingsHome: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { theme } = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          shadowColor: 'transparent', // iOS用
          elevation: 0, // Android用
        },
        headerTitleStyle: {
          fontWeight: theme.component.navigation.header.title.fontWeight,
          fontSize: theme.component.navigation.header.title.fontSize,
          color: theme.component.navigation.header.title.color,
        },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="BudgetMonitorList"
        component={BudgetMonitorList}
        options={{
          tabBarLabel: '予算',
          title: '予算',
        }}
      />
      <Tab.Screen
        name="CashFlow"
        component={CashFlow}
        options={{
          tabBarLabel: '支出',
          title: '',
          headerRight: () => <HeaderRightActions />,
        }}
      />
      <Tab.Screen
        name="CategoryList"
        component={CategoryList}
        options={{ tabBarLabel: 'カテゴリ', title: 'カテゴリ' }}
      />
      <Tab.Screen name="SettingsHome" component={SettingsStack} options={{ tabBarLabel: '設定', headerShown: false }} />
    </Tab.Navigator>
  );
}

type IconProps = {
  focused: boolean;
  color: string;
  size: number;
};
function BudgetTabIcon({ focused, color, size }: IconProps) {
  return <WalletSvg width={size} height={size} stroke={color} />;
}
function CategoryListIcon({ focused, color, size }: IconProps) {
  return <GridSvg width={size} height={size} stroke={color} />;
}
function CashFlowIcon({ focused, color, size }: IconProps) {
  return <GraphSvg width={size} height={size} stroke={color} />;
}
function SettingsIcon({ focused, color, size }: IconProps) {
  return <SettingsSvg width={size} height={size} stroke={color} />;
}
