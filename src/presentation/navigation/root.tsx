import { NavigationProp } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useStyles } from 'react-native-unistyles';

import CategoryForm from '@/src/presentation/screens/CategoryForm';
import CategoryIconSelector from '@/src/presentation/screens/CategoryIconSelector';

import MainTabs from './mainTabs';

export type RootStackParamList = {
  MainTabs: undefined;
  CategoryDetail: { categoryId: string | undefined };
  CategoryIconSelector: undefined;
};
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { theme } = useStyles();
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: {
          shadowColor: 'transparent', // iOS用
          elevation: 0, // Android用
        },
        cardStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryForm}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          headerLeft: () => null,
          headerRightContainerStyle: {
            paddingRight: theme.component.navigation.header.padding.horizontal,
          },
          headerLeftContainerStyle: {
            paddingLeft: theme.component.navigation.header.padding.horizontal,
          },
        }}
      />
      <Stack.Screen name="CategoryIconSelector" component={CategoryIconSelector} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
