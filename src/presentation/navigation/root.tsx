import { NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStyles } from 'react-native-unistyles';

import CategoryForm from '@/src/presentation/screens/CategoryForm';
import CategoryIconSelector from '@/src/presentation/screens/CategoryIconSelector';
import ExpenseForm from '@/src/presentation/screens/ExpenseForm';

import HeaderCloseButton from '../components/HeaderCloseButton';

import MainTabs from './mainTabs';

export type RootStackParamList = {
  MainTabs: undefined;
  CategoryDetail: { categoryId: string | undefined; timestamp: string };
  CategoryIconSelector: undefined;
  ExpenseForm: { expenseId: string | undefined };
};
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { theme } = useStyles();
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background.ground,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryForm}
        options={{
          presentation: 'modal',
          headerLeft: () => <HeaderCloseButton />,
          headerTitleStyle: {
            fontWeight: theme.component.navigation.header.title.fontWeight,
            fontSize: theme.component.navigation.header.title.fontSize,
            color: theme.component.navigation.header.title.color,
          },
        }}
      />
      <Stack.Screen
        name="CategoryIconSelector"
        component={CategoryIconSelector}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseForm}
        options={{
          presentation: 'modal',
          title: '支出',
          headerLeft: () => <HeaderCloseButton />,
          headerTitleStyle: {
            fontWeight: theme.component.navigation.header.title.fontWeight,
            fontSize: theme.component.navigation.header.title.fontSize,
            color: theme.component.navigation.header.title.color,
          },
        }}
      />
    </Stack.Navigator>
  );
}
