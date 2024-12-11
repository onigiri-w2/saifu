import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import PlusSvg from '@/assets/icons/lucide/plus_2px.svg';

function HeaderCloseButton() {
  const { styles, theme } = useStyles(stylesheet);

  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={navigation.goBack}>
      <PlusSvg width={24} height={24} stroke={theme.colors.text.tertiary} style={styles.icon} />
    </TouchableOpacity>
  );
}
export default React.memo(HeaderCloseButton);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: theme.spacing.xhalf,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.layer1,
  },
  icon: {
    transform: [{ rotate: '45deg' }],
  },
}));
