import { Pressable, Text } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { icons } from '../constants';

type Props = {
  index: number;
} & Omit<BottomTabBarProps, 'insets'>;
function Item({ index, state, descriptors, navigation }: Props) {
  const route = state.routes[index];

  const { options } = descriptors[route.key];
  const label = options.title !== undefined ? options.title : route.name;
  const isFocused = state.index === index;
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // @ts-ignore
  const Icon = icons[route.name];

  const { styles, theme } = useStyles(stylesheet, { focused: isFocused });

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Icon
        width={ICON_SIZE}
        height={ICON_SIZE}
        stroke={isFocused ? theme.colors.brand.primary : theme.colors.text.secondary}
      />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const ICON_SIZE = 22;

const stylesheet = createStyleSheet((theme) => ({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.x1,
  },
  text: {
    fontSize: theme.fontSize['subCaption'],
    variants: {
      focused: {
        true: {
          color: theme.colors.brand.primary,
        },
        false: {
          color: theme.colors.text.secondary,
        },
      },
    },
  },
}));

export default Item;
