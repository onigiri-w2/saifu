import { NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStyles } from 'react-native-unistyles';

import CategoryForm from '@/src/presentation/screens/CategoryForm';
import CategoryIconSelector from '@/src/presentation/screens/CategoryIconSelector';

import MainTabs from './mainTabs';

export type RootStackParamList = {
  MainTabs: undefined;
  CategoryDetail: { categoryId: string | undefined; timestamp: string };
  CategoryIconSelector: undefined;
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
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="CategoryIconSelector" component={CategoryIconSelector} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
