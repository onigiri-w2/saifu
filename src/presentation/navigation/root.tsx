import { NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStyles } from 'react-native-unistyles';

import HomePage from '../screens/Home';

export type RootStackParamList = {
  Home: undefined;
};
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { theme } = useStyles();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background.layer1,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
