import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CirclePlusSvg from '@/assets/icons/lucide/circle-plus_1.75px.svg';

type Props = {
  onPress: () => void;
};
function AddButton({ onPress }: Props) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TouchableHighlight underlayColor={theme.colors.highlight.default} onPress={onPress}>
      <View style={styles.container}>
        <CirclePlusSvg width={ICON_SIZE} height={ICON_SIZE} stroke={theme.colors.text.primary} />
        <Text style={styles.text}>新しく追加する</Text>
      </View>
    </TouchableHighlight>
  );
}

const ICON_SIZE = 18;
const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: theme.component.list.row.height.default,
    paddingHorizontal: theme.component.list.row.padding.horizontal,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.x1,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
}));
export default AddButton;
