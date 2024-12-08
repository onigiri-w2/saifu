import React from 'react';
import { View } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import PlusSquareSvg from '@/assets/icons/lucide/square-plus.svg';

import Item from './components/Item';

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const middleIndex = Math.floor(state.routes.length / 2);
  const prevRoutes = state.routes.slice(0, middleIndex);
  const nextRoutes = state.routes.slice(middleIndex);

  const { styles, theme } = useStyles(stylesheet);

  const handlePress = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      // 親のStackNavigatorの'/expense'に遷移
      parentNavigation.navigate('ExpenseForm');
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaView}>
      <View style={styles.tabBar}>
        {prevRoutes.map((route, index) => (
          <Item key={route.name} index={index} state={state} descriptors={descriptors} navigation={navigation} />
        ))}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
            <PlusSquareSvg width={ICON_SIZE} height={ICON_SIZE} stroke={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
        {nextRoutes.map((route, index) => (
          <Item
            key={route.name}
            index={index + middleIndex}
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const ICON_SIZE = 44;
const stylesheet = createStyleSheet((theme) => ({
  safeAreaView: {
    borderTopWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  tabBar: {
    flexDirection: 'row',
    height: theme.component.navigation.bottomBar.height,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: theme.component.navigation.bottomBar.icon.size,
    height: theme.component.navigation.bottomBar.icon.size,
    borderRadius: theme.radius.default,
    borderWidth: 1.5,
    borderColor: theme.colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default TabBar;
