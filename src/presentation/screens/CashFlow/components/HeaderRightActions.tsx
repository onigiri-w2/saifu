import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DisplayModeAction from './DisplayModeAction';

export default function HeaderRightActions() {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <DisplayModeAction />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    paddingRight: theme.component.navigation.header.padding.horizontal - theme.component.navigation.header.icon.padding,
  },
}));
